import express from 'express';
import {
  createSchedule,
  getSchedules,
  updateSchedule,
  deleteSchedule, 
  getSchedulesByPersonnelId,
  updateScheduleStatus
} from '../controllers/schedule.controller';
import { authenticateJWT, authorizeRoles } from '../middleware/auth.middleware';

const router = express.Router();

router.post('/', authenticateJWT, authorizeRoles('admin', 'superadmin'), createSchedule);
router.get('/', authenticateJWT, authorizeRoles('admin', 'superadmin'), getSchedules);
router.put('/:id', authenticateJWT, authorizeRoles('admin', 'superadmin'), updateSchedule);
router.get('/:personnelId', authenticateJWT, authorizeRoles('admin', 'superadmin', 'personnel'), getSchedulesByPersonnelId);
router.patch('/:id/status', authenticateJWT, authorizeRoles('admin', 'superadmin', 'personnel'), updateScheduleStatus);
router.delete('/:id', authenticateJWT, authorizeRoles('admin', 'superadmin'), deleteSchedule);

export default router;
