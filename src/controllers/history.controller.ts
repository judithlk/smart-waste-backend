import { Request, Response } from 'express';
import History from '../models/History';

// // Add a completed/cancelled schedule to history
// export const addToHistory = async (req: Request, res: Response): Promise<any> => {
//   try {
//     const { binId, location, personnelId, scheduledDate, status, createdBy } = req.body;

//     if (!['completed', 'cancelled'].includes(status)) {
//       return res.status(400).json({ message: 'Invalid status for history' });
//     }

//     const newHistory = new History({
//       binId,
//       location,
//       personnelId,
//       scheduledDate,
//       status,
//       createdBy
//     });

//     await newHistory.save();
//     return res.status(201).json({ message: 'History record added', history: newHistory });
//   } catch (err) {
//     return res.status(500).json({ message: 'Error adding to history', error: err });
//   }
// };

// Get all history records
export const getHistory = async (_req: Request, res: Response): Promise<any> => {
  try {
    const history = await History.find();
    return res.json(history);
  } catch (err) {
    return res.status(500).json({ message: 'Error fetching history', error: err });
  }
};
// Get history by binId
export const getHistoryByBinId = async (req: Request, res: Response): Promise<any> => {
  try {
    const { binId } = req.params;
    const history = await History.find({ binId });
    if (!history.length) return res.status(404).json({ message: 'No history found for this bin' });
    return res.json(history);
  } catch (err) {
    return res.status(500).json({ message: 'Error fetching history', error: err });
  }
}
// Get history by personnelId
export const getHistoryByPersonnelId = async (req: Request, res: Response): Promise<any> => {
  try {
    const { personnelId } = req.params;
    const history = await History.find({ personnelId });
    if (!history.length) return res.status(404).json({ message: 'No history found for this personnel' });
    return res.json(history);
  } catch (err) {
    return res.status(500).json({ message: 'Error fetching history', error: err });
  }
};
