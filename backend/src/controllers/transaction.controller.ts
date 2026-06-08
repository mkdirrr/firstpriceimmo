import { Request, Response } from 'express';
import prisma from '../prisma';
import { RequestWithUser } from '../middlewares/auth.middleware';

export async function getTransactions(req: Request, res: Response) {
  try {
    const transactions = await prisma.transaction.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        property: true,
        agent: { select: { id: true, name: true, email: true } },
        lead: true,
      },
    });
    return res.json(transactions);
  } catch (error: any) {
    console.error('getTransactions error:', error.message ?? error);
    return res.status(500).json({ error: 'Unable to fetch transactions.' });
  }
}

export async function getTransactionById(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const transaction = await prisma.transaction.findUnique({
      where: { id },
      include: { property: true, agent: true, lead: true },
    });
    if (!transaction) return res.status(404).json({ error: 'Transaction not found.' });
    return res.json(transaction);
  } catch (error: any) {
    return res.status(500).json({ error: 'Unable to fetch transaction.' });
  }
}

export async function createTransaction(req: RequestWithUser, res: Response) {
  try {
    const { propertyId, leadId, amount, status, closingDate } = req.body;
    
    if (!propertyId || amount === undefined) {
      return res.status(400).json({ error: 'Property ID and amount are required.' });
    }

    const transaction = await prisma.transaction.create({
      data: {
        propertyId,
        leadId: leadId || null,
        agentId: req.user!.userId,
        amount: Number(amount),
        status: status || 'PENDING',
        closingDate: closingDate ? new Date(closingDate) : null,
      },
      include: { property: true, agent: true },
    });

    return res.status(201).json(transaction);
  } catch (error: any) {
    console.error('createTransaction error:', error.message ?? error);
    return res.status(500).json({ error: 'Unable to create transaction.' });
  }
}

export async function updateTransaction(req: RequestWithUser, res: Response) {
  try {
    const { id } = req.params;
    const { amount, status, closingDate, leadId } = req.body;

    const transaction = await prisma.transaction.update({
      where: { id },
      data: {
        ...(amount !== undefined && { amount: Number(amount) }),
        ...(status && { status }),
        ...(closingDate !== undefined && { closingDate: closingDate ? new Date(closingDate) : null }),
        ...(leadId !== undefined && { leadId }),
      },
      include: { property: true, agent: true },
    });

    return res.json(transaction);
  } catch (error: any) {
    console.error('updateTransaction error:', error.message ?? error);
    return res.status(500).json({ error: 'Unable to update transaction.' });
  }
}

export async function deleteTransaction(req: RequestWithUser, res: Response) {
  try {
    const { id } = req.params;
    await prisma.transaction.delete({ where: { id } });
    return res.json({ success: true });
  } catch (error: any) {
    return res.status(500).json({ error: 'Unable to delete transaction.' });
  }
}
