import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";

// Load env vars
dotenv.config();

// Import route handlers
import authRoutes from "./routes/auth.routes";
import binRoutes from "./routes/bin.routes";
import historyRoutes from "./routes/history.routes";
import personnelRoutes from "./routes/personnel.routes";
import scheduleRoutes from "./routes/schedule.routes";
import dashboardRoutes from "./routes/dashboard.routes";

// App setup
const app = express();
const PORT = process.env.PORT || 5000;
const mongoURL = process.env.MONGO_URI || "mongodb://localhost:27017/smartbin";

// Middleware

const allowedOrigins = [
  "http://localhost:3000",
  "https://smart-waste-web-one.vercel.app/",
];

const corsOptions = {
  origin: function (origin: any, callback: any) {
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true, // Allow cookies
};

app.use(cors(corsOptions));
app.use(express.json());

// API routes
app.use("/api/auth", authRoutes);
app.use("/api/bins", binRoutes);
app.use("/api/history", historyRoutes);
app.use("/api/personnel", personnelRoutes);
app.use("/api/schedules", scheduleRoutes);
app.use("/api/dashboard", dashboardRoutes);

// MongoDB connection
mongoose
  .connect(mongoURL)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Start server (only once!)
app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
});
