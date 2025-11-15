import express from 'express';
import { UserController } from '../controllers/userController.js';

const router = express.Router();

router.get('/', UserController.getAll);
router.get('/:email', UserController.getByEmail);

export default router;