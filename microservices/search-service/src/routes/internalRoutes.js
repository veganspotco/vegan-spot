import express from 'express';
import { InternalController } from '../controllers/internalController.js';

const router = express.Router();

// Endpoints internos para sincronización
router.post('/establishments', InternalController.syncEstablishment);
router.put('/establishments/:id', InternalController.updateEstablishment);
router.delete('/establishments/:id', InternalController.deleteEstablishment);

export default router;