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
  process.env.CLIENT_URL, // This should now be your Vercel frontend URL
];

app.use(
  cors({
    origin: function (origin, callback) {
      // allow server-to-server or tools like curl/postman (no origin)
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true, // If using cookies or sessions
  })
);

app.options("*", cors());

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
