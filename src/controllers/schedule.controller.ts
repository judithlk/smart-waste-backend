import { Request, Response } from "express";
import Schedule from "../models/Schedule";
import Bin from "../models/Bin";
import { v4 as uuidv4 } from "uuid";
import axios from "axios";
import dotenv from "dotenv";
dotenv.config();

// Create new schedule
export const createSchedule = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const { binIds, personnelId, scheduledDate, createdBy } = req.body;

    if (!Array.isArray(binIds) || binIds.length < 2) {
      return res
        .status(400)
        .json({
          message: "At least two bins are required to generate a route.",
        });
    }

    // 1. Fetch bins
    const bins: any[] = await Bin.find({ binId: { $in: binIds } });

    if (bins.length !== binIds.length) {
      return res.status(404).json({ message: "Some bins were not found." });
    }

    // 2. Define your custom office location (start and end point)
    const officeLocation = {
      lon: 3.375, // Update with your actual longitude
      lat: 6.52, // Update with your actual latitude
    };

    // 3. Prepare ORS jobs
    const jobs = bins.map((bin, index) => ({
      id: index + 1,
      service: 300, // 5 minutes per bin
      location: [bin.location.lon, bin.location.lat],
    }));

    // 4. Define vehicle starting and ending at office
    const vehicle = {
      id: 1,
      profile: "driving-car",
      start: [officeLocation.lon, officeLocation.lat],
      end: [officeLocation.lon, officeLocation.lat],
    };

    // 5. Send optimization request
    const orsResponse = await axios.post(
      "https://api.openrouteservice.org/optimization",
      {
        jobs,
        vehicles: [vehicle],
      },
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
        orsResponse: orsResponse.data, // Return the full response for debugging
      });
    }

    // 6. Reorder bins by optimized route
    const orderedJobIds = route.steps
      .filter((step: any) => step.type === "job")
      .map((step: any) => step.id);

    const orderedBins = orderedJobIds.map((jobId: number) => {
      const bin = bins[jobId - 1]; // ORS job id = index + 1
      return {
        binId: bin.binId,
        location: bin.location,
      };
    });

    // 7. Save schedule to DB
    const shortId = uuidv4().split('-')[0]; // Take just the first part
    const newSchedule = new Schedule({
      scheduleNo: `SCH${shortId}`,
      bins: orderedBins,
      personnelId,
      scheduledDate,
      createdBy,
      route: route, // save raw route for optional frontend use
    });

    await newSchedule.save();

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

// Update only the status of a schedule (completed or cancelled)
export const updateScheduleStatus = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!["completed", "cancelled"].includes(status)) {
      return res
        .status(400)
        .json({
          message: 'Invalid status. Must be "completed" or "cancelled".',
        });
    }

    const schedule = await Schedule.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    if (!schedule) {
      return res.status(404).json({ message: "Schedule not found" });
    }

    return res.json({ message: "Schedule status updated", schedule });
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Error updating schedule status", error: err });
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

