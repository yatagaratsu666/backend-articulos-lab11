import { Router } from 'express';
import { enableBiometric, getProfile, login, refresh } from '../controllers/authController';
import {register} from '../controllers/authController';
import { authMiddleware } from '../../../middleware/AuthMiddleware';

const router = Router();

router.post('/login', login);
router.post('/register', register);
router.get('/me', authMiddleware, getProfile);

router.post('/enable-biometric', enableBiometric);
router.post('/refresh', refresh);

router.get('/me', authMiddleware, getProfile);

export default router;