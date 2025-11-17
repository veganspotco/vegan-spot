import express from 'express';
import { EstablishmentController } from '../controllers/establishmentController.js';

const router = express.Router();

// Ruta para obtener todos los establecimientos
router.get('/', EstablishmentController.getAllEstablishments);

export default router;