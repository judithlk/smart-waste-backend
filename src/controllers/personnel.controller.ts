import { Request, Response } from "express";
import Personnel from "../models/Personnel";
import { v4 as uuidv4 } from "uuid";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const JWT_SECRET = "your_secret_key"; // move to env var in prod

export const registerPersonnel = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const { personnelId, name, phone, email, password } = req.body;

    // check existing by email or personnelId
    if (await Personnel.findOne({ email })) {
      return res.status(400).json({ message: "Email already registered" });
    }
    if (await Personnel.findOne({ personnelId })) {
      return res.status(400).json({ message: "Personnel ID already in use" });
    }

    const hashed = await bcrypt.hash(password, 10);
    const newPersonnel = new Personnel({
      personnelId,
      name,
      phone,
      email,
      password: hashed,
    });
    await newPersonnel.save();
    return res
      .status(201)
      .json({ message: "Personnel registered successfully" });
  } catch (err) {
    return res.status(500).json({ message: "Registration failed", error: err });
  }
};

export const loginPersonnel = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const { personnelId, password } = req.body;
    const person = await Personnel.findOne({ personnelId }).exec();
    if (!person || !person.password) {
      return res.status(404).json({ message: "Personnel not found" });
    }
    const match = await bcrypt.compare(password, person.password);
    if (!match) {
      return res.status(400).json({ message: "Invalid credentials" });
    }
    const token = jwt.sign({ id: person._id, role: person.role }, JWT_SECRET, {
      expiresIn: "7d",
    });
    return res.json({
      token,
      personnel: {
        id: person._id,
        personnelId: person.personnelId,
        name: person.name,
        phone: person.phone,
        email: person.email,
        role: person.role,
      },
    });
  } catch (err) {
    return res.status(500).json({ message: "Login failed", error: err });
  }
};

export const updatePersonnel = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const { id } = req.params; // MongoDB _id or use personnelId if preferred
    const updates = req.body;

    // If updating password, hash the new one
    if (updates.password) {
      updates.password = await bcrypt.hash(updates.password, 10);
    }

    const updated = await Personnel.findByIdAndUpdate(id, updates, {
      new: true,
    });

    if (!updated) {
      return res.status(404).json({ message: "Personnel not found" });
    }

    return res.json({ message: "Personnel updated", personnel: updated });
  } catch (err) {
    return res.status(500).json({ message: "Update failed", error: err });
  }
};

export const getAllPersonnel = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const personnelList = await Personnel.find().select("-password"); // exclude passwords
    return res.json(personnelList);
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Failed to fetch personnel", error: err });
  }
};

export const getPersonnelById = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const { id } = req.params;
    const person = await Personnel.findById(id).select("-password");

    if (!person) {
      return res.status(404).json({ message: "Personnel not found" });
    }

    return res.json(person);
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Failed to fetch personnel", error: err });
  }
};

export const getPersonnelByPersonnelId = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const personnel = await Personnel.findOne({
      personnelId: req.params.personnelId,
    });
    if (!personnel)
      return res.status(404).json({ message: "Personnel not found" });
    res.json(personnel);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// PATCH /api/personnel/push-token
export const updatePushToken = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const { token } = req.body;
    const id = req.user?.id; // From JWT
    const updated = await Personnel.findByIdAndUpdate(id, { pushToken: token });
    if (!updated) {
      return res.status(404).json({ message: "Personnel not found" });
    }
    res.json({ message: "Push token updated" });
  } catch (err) {
    return res.status(500).json({ message: "Failed to update token", error: err });
  }
};
