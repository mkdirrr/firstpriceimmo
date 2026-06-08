import { Router } from 'express';
import { getUsers, getUserById } from '../controllers/user.controller';
import { requireAdmin } from '../middlewares/requireAdmin';

const router = Router();

router.get('/', requireAdmin, getUsers);
router.get('/:id', requireAdmin, getUserById);

export default router;
