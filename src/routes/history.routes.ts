import express from 'express';
import {
  getHistory,
  getHistoryByBinId,
  getHistoryByPersonnelId
} from '../controllers/history.controller';

const router = express.Router();

router.get('/', getHistory);
router.get('/bin/:binId', getHistoryByBinId);
router.get('/personnel/:personnelId', getHistoryByPersonnelId);

export default router;
