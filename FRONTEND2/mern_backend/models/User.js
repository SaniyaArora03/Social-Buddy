import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  role: { type: String, enum: ["parent","child"], required: true },
  age: Number,
  disability: String,
  parentEmail: String,
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model("User", UserSchema);
