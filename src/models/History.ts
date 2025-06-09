import mongoose from 'mongoose';

const historySchema = new mongoose.Schema({
  scheduleNo: { type: String, unique: true },
  bins: [
    {
      binId: String,
      location: {
        lat: Number,
        lon: Number,
        address: String,
      },
    },
  ],
  route: {
    type: Object, // GeoJSON route or encoded polyline
    default: null,
  },
  personnelId: { type: String, required: true },
  scheduledDate: { type: Date, required: true },
  createdAt: { type: Date, required: true},
  markedAt: { type: Date, default: Date.now },
  createdBy: { type: String, required: true }, // admin username
  status: {
    type: String,
    enum: ["completed", "cancelled"],
  },
});

export default mongoose.model('History', historySchema);
