import { Router } from 'express';
import { submitContactLead, getContactLeads, updateContactLeadStatus, deleteContactLead } from '../controllers/contact.controller';
import { requireAdmin } from '../middlewares/requireAdmin';

const router = Router();

router.post('/', submitContactLead);
router.get('/', requireAdmin, getContactLeads);
router.put('/:id', requireAdmin, updateContactLeadStatus);
router.delete('/:id', requireAdmin, deleteContactLead);

export default router;
