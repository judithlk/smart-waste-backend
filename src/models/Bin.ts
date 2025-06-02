import mongoose from "mongoose";

const binSchema = new mongoose.Schema({
  binId: { type: String, required: true, unique: true },
  location: {
    lat: { type: Number, min: -90, max: 90, default: null },
    lon: { type: Number, min: -180, max: 180, default: null },
    address: String,
  },
  placementDate: { type: Date, default: Date.now },
  lastEmptiedAt: { type: Date, default: null },
  status: { type: String, enum: ["active", "disabled"], default: "active" },
  fillLevel: {
    type: String,
    enum: ["empty", "25%", "50%", "75%", "95%", "full"],
    default: "empty",
  },
});

export default mongoose.model("Bin", binSchema);
