import { Request, Response } from 'express';
import prisma from '../prisma';
import { validateContactLead } from '../utils/validation';

export async function submitContactLead(req: Request, res: Response) {
  try {
    const errors = validateContactLead(req.body);

    if (errors.length) {
      return res.status(400).json({ errors });
    }

    const contactLead = await prisma.contactLead.create({
      data: {
        name: req.body.name,
        email: req.body.email,
        phone: req.body.phone,
        propertyId: req.body.propertyId,
      },
    });

    return res.status(201).json(contactLead);
  } catch (error: any) {
    console.error('submitContactLead error:', error.message ?? error);
    return res.status(500).json({ error: 'Unable to submit contact lead. Database may be unavailable.' });
  }
}

export async function getContactLeads(req: Request, res: Response) {
  try {
    const leads = await prisma.contactLead.findMany({
      orderBy: { createdAt: 'desc' },
      include: { property: true },
    });

    return res.json(leads);
  } catch (error: any) {
    console.error('getContactLeads error:', error.message ?? error);
    return res.status(500).json({ error: 'Unable to fetch contact leads. Database may be unavailable.' });
  }
}

export async function updateContactLeadStatus(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const { status, notes } = req.body;
    
    if (status && !['PENDING', 'IN_PROGRESS', 'COMPLETED', 'LOST'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status.' });
    }
    
    const dataToUpdate: any = {};
    if (status) dataToUpdate.status = status;
    if (notes !== undefined) dataToUpdate.notes = notes;

    const lead = await prisma.contactLead.update({
      where: { id },
      data: dataToUpdate,
    });
    return res.json(lead);
  } catch (error: any) {
    console.error('updateContactLeadStatus error:', error.message ?? error);
    return res.status(500).json({ error: 'Unable to update status.' });
  }
}

export async function deleteContactLead(req: Request, res: Response) {
  try {
    const { id } = req.params;
    await prisma.contactLead.delete({
      where: { id },
    });
    return res.json({ success: true });
  } catch (error: any) {
    console.error('deleteContactLead error:', error.message ?? error);
    return res.status(500).json({ error: 'Unable to delete contact lead.' });
  }
}
