import { Request, Response } from "express";
import Bin from "../models/Bin";
import { v4 as uuidv4 } from "uuid";

// Create a new bin
export const createBin = async (req: Request, res: Response): Promise<any> => {
  try {
    const { binId, location, placementDate } = req.body;

    const existing = await Bin.findOne({ binId });
    if (existing)
      return res.status(400).json({ message: "Bin already exists" });

    const bin = new Bin({
      binId,
      location,
      placementDate,
    });

    await bin.save();

    return res.status(201).json({ message: "Bin created successfully", bin });
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Failed to create bin", error: err });
  }
};

// Get all bins
export const getBins = async (_req: Request, res: Response): Promise<any> => {
  try {
    const bins = await Bin.find();
    return res.json(bins);
  } catch (err) {
    return res.status(500).json({ message: "Error fetching bins", error: err });
  }
};

// Get a bin by ID
export const getBin = async (req: Request, res: Response): Promise<any> => {
  try {
    const bin = await Bin.findOne({ binId: req.params.id });
    if (!bin) return res.status(404).json({ message: "Bin not found" });

    return res.json(bin);
  } catch (err) {
    return res.status(500).json({ message: "Error fetching bin", error: err });
  }
};

// Update a bin
export const updateBin = async (req: Request, res: Response): Promise<any> => {
  try {
    const updatedBin = await Bin.findOneAndUpdate(
      { binId: req.params.id },
      req.body,
      { new: true }
    );
    if (!updatedBin) return res.status(404).json({ message: "Bin not found" });

    return res.json({ message: "Bin updated", bin: updatedBin });
  } catch (err) {
    return res.status(500).json({ message: "Error updating bin", error: err });
  }
};

//Update status of a bin
export const updateBinStatus = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const { id } = req.params; // binId
    const { status } = req.body;

    if (!["active", "disabled"].includes(status)) {
      return res.status(400).json({ message: "Invalid status value" });
    }

    const updatedBin = await Bin.findOneAndUpdate(
      { binId: id },
      { status },
      { new: true }
    );

    if (!updatedBin) {
      return res.status(404).json({ message: "Bin not found" });
    }

    return res.json({ message: "Bin status updated", bin: updatedBin });
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Error updating bin status", error: err });
  }
};

// Delete a bin
export const deleteBin = async (req: Request, res: Response): Promise<any> => {
  try {
    const deleted = await Bin.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Bin not found" });

    return res.json({ message: "Bin deleted" });
  } catch (err) {
    return res.status(500).json({ message: "Error deleting bin", error: err });
  }
};
