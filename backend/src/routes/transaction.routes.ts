import { Router } from 'express';
import {
  getTransactions,
  getTransactionById,
  createTransaction,
  updateTransaction,
  deleteTransaction,
} from '../controllers/transaction.controller';
import { requireAdmin } from '../middlewares/requireAdmin';

const router = Router();

router.get('/', requireAdmin, getTransactions);
router.get('/:id', requireAdmin, getTransactionById);
router.post('/', requireAdmin, createTransaction);
router.put('/:id', requireAdmin, updateTransaction);
router.delete('/:id', requireAdmin, deleteTransaction);

export default router;
