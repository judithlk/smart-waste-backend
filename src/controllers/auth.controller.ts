import Admin from "../models/Admin";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { Request, Response } from "express";

const JWT_SECRET = "your_secret_key"; // Replace with env var in production

export const register = async (req: Request, res: Response): Promise<any> => {
  try {
    const { username, email, password, role } = req.body;

    const existing = await Admin.findOne({ email });
    if (existing)
      return res.status(400).json({ message: "Admin already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const newAdmin = new Admin({
      username,
      email,
      password: hashedPassword,
      role,
    });
    await newAdmin.save();

    return res.status(201).json({ message: "Admin registered successfully" });
  } catch (err) {
    return res.status(500).json({ message: "Registration failed", error: err });
  }
};

export const login = async (req: Request, res: Response): Promise<any> => {
  try {
    const { username, password } = req.body;

    const admin = await Admin.findOne({ username }).exec();
    if (!admin || !admin.password) {
      return res
        .status(404)
        .json({ message: "Admin not found or password missing" });
    }

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid password" });
    }

    const token = jwt.sign(
      { id: admin._id, role: admin.role },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

     res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // true in prod
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in milliseconds
      sameSite: "lax",
      path: "/",
    });

    return res.json({
      admin: {
        id: admin._id,
        username: admin.username,
        role: admin.role,
        email: admin.email,
      },
    });
  } catch (err) {
    return res.status(500).json({ message: "Login failed", error: err });
  }
};

export const logout = (req: Request, res: Response): any => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
  });
  return res.json({ message: "Logged out successfully" });
};