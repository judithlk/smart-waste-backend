import mongoose from 'mongoose';

const personnelSchema = new mongoose.Schema({
  personnelId: { type: String, unique: true },
  name: String,
  phone: String,
  email: { type: String, unique: true },
  password: String,
  role: {
    type: String,
    default: 'personnel'
  },
  pushToken: { type: String, default: null },
});

export default mongoose.model('Personnel', personnelSchema);
