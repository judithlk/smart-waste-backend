import { Router } from 'express';
import { registerPersonnel, loginPersonnel, updatePersonnel, getAllPersonnel, getPersonnelById, getPersonnelByPersonnelId, updatePushToken } from '../controllers/personnel.controller';
import { authenticateJWT, authorizeRoles } from '../middleware/auth.middleware';

const router = Router();

router.post('/register', authenticateJWT, authorizeRoles('admin', 'superadmin'), registerPersonnel);
router.put('/:id', authenticateJWT, authorizeRoles('admin', 'superadmin', 'personnel'), updatePersonnel);
router.get('/', authenticateJWT, authorizeRoles('admin', 'superadmin'), getAllPersonnel);
router.get('/:id', authenticateJWT, authorizeRoles('admin', 'superadmin', 'personnel'), getPersonnelById);
router.get('/by-personnel-id/:personnelId', authenticateJWT, authorizeRoles('admin', 'superadmin', 'personnel'), getPersonnelByPersonnelId);
router.post('/login', loginPersonnel);
router.patch('/push-token')

export default router;
