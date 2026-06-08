import { Request, Response } from 'express';
import prisma from '../prisma';
import { validatePropertyPayload } from '../utils/validation';
import { RequestWithUser } from '../middlewares/auth.middleware';
import { uploadBufferToCloudinary } from '../services/cloudinary.service';

async function resolveImageUrls(req: Request) {
  const files = req.files as Express.Multer.File[] | undefined;
  const uploadedUrls: string[] = [];

  if (files?.length) {
    for (const file of files) {
      const url = await uploadBufferToCloudinary(file.buffer, file.originalname);
      if (url) uploadedUrls.push(url);
    }
    return uploadedUrls;
  }

  if (req.body.imageUrls) {
    try {
      return typeof req.body.imageUrls === 'string'
        ? JSON.parse(req.body.imageUrls)
        : req.body.imageUrls;
    } catch {
      return [];
    }
  }

  return [];
}

export async function getProperties(req: Request, res: Response) {
  try {
    const { category, transactionType, status } = req.query;

    const filters: any = {
      ...(category ? { category: category as string } : {}),
      ...(transactionType ? { transactionType: transactionType as string } : {}),
      ...(status ? { status: status as string } : {}),
    };

    const properties = await prisma.property.findMany({
      where: filters,
      orderBy: { createdAt: 'desc' },
    });

    return res.json(properties);
  } catch (error: any) {
    console.error('getProperties error:', error.message ?? error);
    return res.status(500).json({ error: 'Unable to fetch properties. Database may be unavailable.' });
  }
}

export async function getPropertyById(req: Request, res: Response) {
  const { id } = req.params;
  try {
    const property = await prisma.property.findUnique({
      where: { id },
      include: { contactLeads: true },
    });

    if (!property) {
      return res.status(404).json({ error: 'Property not found.' });
    }

    return res.json(property);
  } catch (error: any) {
    console.error('getPropertyById error:', error.message ?? error);
    return res.status(500).json({ error: 'Unable to fetch property. Database may be unavailable.' });
  }
}

export async function createProperty(req: RequestWithUser, res: Response) {
  try {
    const imageUrls = await resolveImageUrls(req);
    const errors = validatePropertyPayload({ ...req.body, imageUrls }, Boolean(req.files));

    if (errors.length) {
      return res.status(400).json({ errors });
    }

    const property = await prisma.property.create({
      data: {
        title: req.body.title,
        description: req.body.description,
        category: req.body.category,
        transactionType: req.body.transactionType,
        price: req.body.price !== undefined ? Number(req.body.price) : 0,
        imageUrls,
        status: req.body.status ?? 'ACTIVE',
        userId: req.user!.userId,
      },
    });

    return res.status(201).json(property);
  } catch (error: any) {
    console.error('createProperty error:', error.message ?? error);
    return res.status(500).json({ error: 'Unable to create property. Database may be unavailable.' });
  }
}

export async function updateProperty(req: RequestWithUser, res: Response) {
  const { id } = req.params;
  try {
    const property = await prisma.property.findUnique({ where: { id } });

    if (!property) {
      return res.status(404).json({ error: 'Property not found.' });
    }

    const imageUrls = await resolveImageUrls(req);
    const nextImageUrls = imageUrls.length ? imageUrls : property.imageUrls;
    const errors = validatePropertyPayload({ ...property, ...req.body, imageUrls: nextImageUrls }, Boolean(req.files));

    if (errors.length) {
      return res.status(400).json({ errors });
    }

    const updated = await prisma.property.update({
      where: { id },
      data: {
        title: req.body.title,
        description: req.body.description,
        category: req.body.category,
        transactionType: req.body.transactionType,
        price: req.body.price !== undefined ? Number(req.body.price) : property.price,
        imageUrls: nextImageUrls,
        status: req.body.status ?? property.status,
      },
    });

    return res.json(updated);
  } catch (error: any) {
    console.error('updateProperty error:', error.message ?? error);
    return res.status(500).json({ error: 'Unable to update property. Database may be unavailable.' });
  }
}

export async function deleteProperty(req: RequestWithUser, res: Response) {
  const { id } = req.params;
  try {
    await prisma.$transaction([
      prisma.contactLead.deleteMany({ where: { propertyId: id } }),
      prisma.property.delete({ where: { id } }),
    ]);
    return res.json({ success: true });
  } catch (error: any) {
    console.error('deleteProperty error:', error.message ?? error);
    return res.status(500).json({ error: 'Unable to delete property. Database may be unavailable.' });
  }
}
