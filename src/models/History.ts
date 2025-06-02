import mongoose from 'mongoose';

const historySchema = new mongoose.Schema({
  binId: { type: String, required: true },
  location: {
    lat: Number,
    lon: Number,
    address: String
  },
  personnelId: { type: String, required: true },
  scheduledDate: { type: Date, required: true },
  createdAt: { type: Date, default: Date.now },
  status: { 
    type: String, 
    enum: ['completed', 'cancelled'], 
    required: true 
  },
  createdBy: { type: String } // Admin username
});

export default mongoose.model('History', historySchema);
