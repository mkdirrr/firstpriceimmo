import { Router } from 'express';
import multer from 'multer';
import {
  getProperties,
  getPropertyById,
  createProperty,
  updateProperty,
  deleteProperty,
} from '../controllers/property.controller';
import { requireAdmin } from '../middlewares/requireAdmin';

const router = Router();
const upload = multer({ storage: multer.memoryStorage(), limits: { files: 10, fileSize: 50 * 1024 * 1024 } });

router.get('/', getProperties);
router.get('/:id', getPropertyById);
router.post('/', requireAdmin, upload.array('images', 10), createProperty);
router.put('/:id', requireAdmin, upload.array('images', 10), updateProperty);
router.delete('/:id', requireAdmin, deleteProperty);

export default router;
