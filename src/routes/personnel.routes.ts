import { Router } from 'express';
import { registerPersonnel, loginPersonnel, updatePersonnel } from '../controllers/personnel.controller';
import { authenticateJWT, authorizeRoles } from '../middleware/auth.middleware';

const router = Router();

router.post('/register', authenticateJWT, authorizeRoles('admin', 'superadmin'), registerPersonnel);
router.put('/:id', authenticateJWT, authorizeRoles('admin', 'superadmin', 'personnel'), updatePersonnel);
router.post('/login', loginPersonnel);

export default router;
