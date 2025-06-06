import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";

import authRoutes from "./routes/auth.routes";
import binRoutes from "./routes/bin.routes";
import historyRoutes from "./routes/history.routes";
import personnelRoutes from "./routes/personnel.routes";
import scheduleRoutes from "./routes/schedule.routes";
import dashboardRoutes from "./routes/dashboard.routes";

dotenv.config();

const app = express();

// Middleware
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:3000",
    credentials: true,
  })
);
app.use(express.json());

// Routes
app.get("/", (req, res) => {
  res.send("SmartBin Backend API is running 🚀");
});
app.use("/api/auth", authRoutes);
app.use("/api/bins", binRoutes);
app.use("/api/history", historyRoutes);
app.use("/api/personnel", personnelRoutes);
app.use("/api/schedules", scheduleRoutes);
app.use("/api/dashboard", dashboardRoutes);

// MongoDB connection
const mongoURL = process.env.MONGO_URL || "mongodb://localhost:27017/smartbin";
mongoose
  .connect(mongoURL)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

// For local development only
if (process.env.NODE_ENV !== "production") {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`🚀 Server running at http://localhost:${PORT}`);
  });
}

// 👇 Export app for Vercel
export default app;
