import express from 'express';
import { SyncController } from '../controllers/syncController.js';

const router = express.Router();

// Endpoint para sincronización manual
router.post('/sync/all', SyncController.syncAll);

export default router;