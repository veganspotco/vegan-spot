import express from 'express';
import { getLocationByEstablishmentId, updateLocation } from '../controllers/locationController.js';

const router = express.Router();

router.get('/:id', getLocationByEstablishmentId);
router.put('/:id', updateLocation);

export default router;
