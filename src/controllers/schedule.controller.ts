import { Request, Response } from "express";
import Schedule from "../models/Schedule";
import History from "../models/History";
import Personnel from "../models/Personnel";
import Bin from "../models/Bin";
import { sendPushNotification } from "../utils/sendPushNotification";
import { v4 as uuidv4 } from "uuid";
import axios from "axios";
import dotenv from "dotenv";
dotenv.config();

// Create new schedule
export const createSchedule = async (req: Request, res: Response): Promise<any> => {
  try {
    const { binIds, personnelId, scheduledDate, createdBy } = req.body;

    if (!Array.isArray(binIds) || binIds.length < 2) {
      return res.status(400).json({
        message: "At least two bins are required to generate a route.",
      });
    }

    const bins: any[] = await Bin.find({ binId: { $in: binIds } });

    if (bins.length !== binIds.length) {
      return res.status(404).json({ message: "Some bins were not found." });
    }

    const officeLocation = {
      lon: 3.375,
      lat: 6.52,
    };

    const jobs = bins.map((bin, index) => ({
      id: index + 1,
      service: 300,
      location: [bin.location.lon, bin.location.lat],
    }));

    const vehicle = {
      id: 1,
      profile: "driving-car",
      start: [officeLocation.lon, officeLocation.lat],
      end: [officeLocation.lon, officeLocation.lat],
    };

    const orsResponse = await axios.post(
      "https://api.openrouteservice.org/optimization",
      { jobs, vehicles: [vehicle] },
      {
        headers: {
          Authorization: process.env.ORS_API_KEY!,
          "Content-Type": "application/json",
        },
      }
    );

    const route = orsResponse.data.routes?.[0];

    if (!route) {
      return res.status(500).json({
        message: "ORS optimization failed. No solution returned.",
        orsResponse: orsResponse.data,
      });
    }

    const orderedJobIds = route.steps
      .filter((step: any) => step.type === "job")
      .map((step: any) => step.id);

    const orderedBins = orderedJobIds.map((jobId: number) => {
      const bin = bins[jobId - 1];
      return {
        binId: bin.binId,
        location: bin.location,
      };
    });

    const shortId = uuidv4().split("-")[0];
    const newSchedule = new Schedule({
      scheduleNo: `SCH${shortId}`,
      bins: orderedBins,
      personnelId,
      scheduledDate,
      createdBy,
      route: route,
    });

    await newSchedule.save();

    // ✅ STEP 4: Send push notification to personnel
    const personnel = await Personnel.findById(personnelId);
    if (personnel?.pushToken) {
      await sendPushNotification(
        personnel.pushToken,
        "New Schedule Assigned",
        `Schedule SCH${shortId} has been assigned to you.`
      );
    }

    return res.status(201).json({
      message: "Optimized schedule created",
      schedule: newSchedule,
    });
  } catch (err: any) {
    console.error(err?.response?.data || err);
    return res.status(500).json({
      message: "Error creating optimized schedule",
      error: err?.response?.data || err.message,
    });
  }
};


// Get all schedules
export const getSchedules = async (
  _req: Request,
  res: Response
): Promise<any> => {
  try {
    const schedules = await Schedule.find();
    return res.json(schedules);
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Error fetching schedules", error: err });
  }
};

// Update a schedule by ID
export const updateSchedule = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const schedule = await Schedule.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!schedule)
      return res.status(404).json({ message: "Schedule not found" });
    return res.json({ message: "Schedule updated", schedule });
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Error updating schedule", error: err });
  }
};

// Delete a schedule
export const deleteSchedule = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const deleted = await Schedule.findByIdAndDelete(req.params.id);
    if (!deleted)
      return res.status(404).json({ message: "Schedule not found" });
    return res.json({ message: "Schedule deleted" });
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Error deleting schedule", error: err });
  }
};

// Get schedules by personnel ID
// This function retrieves all schedules for a specific personnel ID
export const getSchedulesByPersonnelId = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const { personnelId } = req.params;

    const schedules = await Schedule.find({ personnelId });

    if (!schedules.length) {
      return res
        .status(404)
        .json({ message: "No schedules found for this personnel" });
    }

    return res.json(schedules);
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Error fetching schedules", error: err });
  }
};

export const updateScheduleStatus = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!["completed", "cancelled"].includes(status)) {
      return res.status(400).json({
        message: 'Invalid status. Must be "completed" or "cancelled".',
      });
    }

    // Fetch the schedule by ID
    const schedule = await Schedule.findById(id);

    if (!schedule) {
      return res.status(404).json({ message: "Schedule not found" });
    }

    // Update status
    schedule.status = status;
    await schedule.save();

    // Build history entry
    const historyData = {
      scheduleNo: schedule.scheduleNo, // ✅ use original schedule number
      bins: schedule.bins,
      route: schedule.route || null,
      personnelId: schedule.personnelId,
      scheduledDate: schedule.scheduledDate,
      markedAt: new Date(),
      createdBy: schedule.createdBy,
      createdAt: schedule.createdAt,
      status,
    };

    // Save history entry
    const newHistory = new History(historyData);
    await newHistory.save();

    // Delete the original schedule
    await Schedule.findByIdAndDelete(id);

    return res.status(200).json({
      message: "Schedule marked and moved to history",
      history: newHistory,
    });
  } catch (err) {
    console.error("Error updating schedule and creating history:", err);
    return res.status(500).json({
      message: "Error updating schedule status",
      error: err,
    });
  }
};



// Get a schedule by ID
export const getScheduleById = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const { id } = req.params;

    const schedule = await Schedule.findById(id);

    if (!schedule) {
      return res.status(404).json({ message: "Schedule not found" });
    }

    return res.json(schedule);
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Error fetching schedule", error: err });
  }
};

