import express from "express";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config();
import mongoose from "mongoose";
import authRoutes from "./routes/auth.routes";
import binRoutes from "./routes/bin.routes";
import historyRoutes from "./routes/history.routes";
import personnelRoutes from "./routes/personnel.routes";
import scheduleRoutes from "./routes/schedule.routes";
import dashboardRoutes from "./routes/dashboard.routes"

const app = express();
const PORT = process.env.PORT || 5000;
const mongoURL = process.env.MONGO_URL || "mongodb://localhost:27017/smartbin";

app.use(
  cors({
    origin: "http://localhost:3000", // your frontend URL
    credentials: true,
  })
);
app.listen(5000, '0.0.0.0', () => {
  console.log('Server is running on port 5000');
});
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/bins", binRoutes);
app.use("/api/history", historyRoutes);
app.use("/api/personnel", personnelRoutes);
app.use("/api/schedules", scheduleRoutes);
app.use("/api/dashboard", dashboardRoutes);

mongoose
  .connect(mongoURL)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

module.exports = app;
