import express from 'express';
import { AuditController } from '../controllers/auditController.js';

const router = express.Router();

router.get('/', AuditController.getAuditLogList);

export default router;