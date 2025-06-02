import mongoose from "mongoose";

const adminSchema = new mongoose.Schema({
  username: String,
  email: { type: String, unique: true },
  password: String,
  role: { type: String, enum: ["superadmin", "admin"], default: "admin" },
  permissions: [String],
});

export default mongoose.model("Admin", adminSchema);
