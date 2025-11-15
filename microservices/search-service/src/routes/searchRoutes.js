import express from 'express';
import { SearchController } from '../controllers/searchController.js';

const router = express.Router();

// Búsquedas públicas
router.get('/search/city', SearchController.searchByCity);
router.get('/search/filters', SearchController.searchWithFilters);
router.get('/search/location', SearchController.searchByLocation);
router.get('/:id', SearchController.getById);

export default router;