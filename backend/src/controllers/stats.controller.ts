import { Request, Response } from 'express';
import prisma from '../prisma';

export async function getDashboardStats(req: Request, res: Response) {
  try {
    const [totalProperties, totalLeads, totalUsers, activeProperties, saleProperties, rentProperties] = await Promise.all([
      prisma.property.count(),
      prisma.contactLead.count(),
      prisma.user.count(),
      prisma.property.count({ where: { status: 'ACTIVE' } }),
      prisma.property.count({ where: { transactionType: 'SALE' } }),
      prisma.property.count({ where: { transactionType: 'RENT' } }),
    ]);

    const recentProperties = await prisma.property.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      select: { id: true, title: true, category: true, price: true, status: true, createdAt: true },
    });

    const recentLeads = await prisma.contactLead.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      include: { property: { select: { title: true } } },
    });

    return res.json({
      totalProperties,
      totalLeads,
      totalUsers,
      activeProperties,
      saleProperties,
      rentProperties,
      recentProperties,
      recentLeads,
    });
  } catch (error: any) {
    console.error('getDashboardStats error:', error.message ?? error);
    return res.status(500).json({ error: 'Unable to fetch dashboard stats.' });
  }
}
