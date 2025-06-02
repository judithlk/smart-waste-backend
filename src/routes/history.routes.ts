import express from 'express';
import {
  addToHistory,
  getHistory,
  getHistoryByBinId,
  getHistoryByPersonnelId
} from '../controllers/history.controller';

const router = express.Router();

router.post('/', addToHistory);
router.get('/', getHistory);
router.get('/bin/:binId', getHistoryByBinId);
router.get('/personnel/:personnelId', getHistoryByPersonnelId);

export default router;
