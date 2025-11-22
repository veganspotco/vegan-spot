import express from 'express';
import { UserController } from '../controllers/userController.js';

const router = express.Router();

router.post('/register', UserController.register);
router.get('/', UserController.getAll);
router.get('/:email', UserController.getByEmail);
router.post('/login', UserController.login);

export default router;