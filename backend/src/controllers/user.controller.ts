import { Request, Response } from 'express';
import prisma from '../prisma';

export async function getUsers(req: Request, res: Response) {
  try {
    const users = await prisma.user.findMany({
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        createdAt: true,
        updatedAt: true,
        _count: { select: { properties: true } },
      },
    });

    return res.json(users.map((u) => ({
      ...u,
      propertyCount: u._count.properties,
      _count: undefined,
    })));
  } catch (error: any) {
    console.error('getUsers error:', error.message ?? error);
    return res.status(500).json({ error: 'Unable to fetch users.' });
  }
}

export async function getUserById(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        createdAt: true,
        updatedAt: true,
        properties: {
          orderBy: { createdAt: 'desc' },
          select: { id: true, title: true, category: true, price: true, status: true, createdAt: true },
        },
      },
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found.' });
    }

    return res.json(user);
  } catch (error: any) {
    console.error('getUserById error:', error.message ?? error);
    return res.status(500).json({ error: 'Unable to fetch user.' });
  }
}
