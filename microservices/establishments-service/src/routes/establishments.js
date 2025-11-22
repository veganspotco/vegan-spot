import express from 'express';
import { EstablishmentController } from '../controllers/establishmentController.js';
import { validate } from '../middleware/validationMiddleware.js';
import { auditMiddleware } from '../middleware/auditMiddleware.js'
import { createEstablishmentSchema, updateEstablishmentSchema } from '../validators/establishmentValidator.js';

const router = express.Router();

// POST /api/establishments - Historia de Usuario 1.1
router.post(
  '/',
  validate(createEstablishmentSchema),
  auditMiddleware('create'),
  EstablishmentController.create
);

// GET /api/establishments/cities - Obtiene las ciudades disponibles
router.get('/cities', EstablishmentController.getAvailableCities);

// PUT /api/establishments/:id - Historia de Usuario 1.2
router.put(
  '/:id',
  validate(updateEstablishmentSchema),
  auditMiddleware('update'),
  EstablishmentController.update
);

// GET /api/establishments/:id
router.get('/:id', EstablishmentController.getById);

// GET /api/establishments
router.get('/', EstablishmentController.getAll);

// GET /api/establishments/:id/audit - Historial de modificaciones
router.get('/:id/audit', EstablishmentController.getAuditLog);

export default router;