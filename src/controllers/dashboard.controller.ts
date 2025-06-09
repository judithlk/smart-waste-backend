import { Request, Response } from "express";
import Bin from "../models/Bin";
import Schedule from "../models/Schedule";
import Personnel from "../models/Personnel";
import History from "../models/History";

export const getDashboardSummary = async (req: Request, res: Response): Promise<any> => {
  try {
    const totalBins = await Bin.countDocuments();

    const totalPendingDisposals = await Schedule.countDocuments({
      status: "pending",
    });

    const registeredPersonnel = await Personnel.countDocuments();

    const tripsCompleted = await History.countDocuments({
      status: "completed",
    });

    return res.status(200).json({
      totalBins,
      totalPendingDisposals,
      registeredPersonnel,
      tripsCompleted,
    });
  } catch (error) {
    console.error("Dashboard summary error:", error);
    return res.status(500).json({ message: "Failed to get dashboard summary" });
  }
};
