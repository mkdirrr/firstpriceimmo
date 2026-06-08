import { Router } from 'express';
import { getDashboardStats } from '../controllers/stats.controller';
import { requireAdmin } from '../middlewares/requireAdmin';

const router = Router();

router.get('/', requireAdmin, getDashboardStats);

export default router;
