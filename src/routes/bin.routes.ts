import express from 'express';
import {
  createBin,
  getBins,
  getBin,
  updateBin,
  deleteBin,
  updateBinStatus,
} from '../controllers/bin.controller';
import { authenticateJWT, authorizeRoles } from '../middleware/auth.middleware';

const router = express.Router();

router.post('/', authenticateJWT, authorizeRoles('admin', 'superadmin'), createBin);
router.put('/by-binId/:binId', updateBin);
// router.post('/by-binId/:binId', updateBin);
router.patch('/:id/status', authenticateJWT, authorizeRoles('admin', 'superadmin', 'personnel'), updateBinStatus);
router.delete('/:id', authenticateJWT, authorizeRoles('admin', 'superadmin'), deleteBin);
router.get('/', authenticateJWT, authorizeRoles('admin', 'superadmin'), getBins);
router.get('/:id', authenticateJWT, authorizeRoles('admin', 'superadmin', 'personnel'), getBin);

export default router;
