import express from 'express';
import { register, login, logout } from '../controllers/auth.controller';
import { authenticateJWT, authorizeRoles } from '../middleware/auth.middleware';

const router = express.Router();

router.post('/register', authenticateJWT, authorizeRoles('superadmin'), register);
router.post('/login', login);
router.post('/logout', logout);


export default router;
