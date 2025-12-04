import mongoose from "mongoose";

const FeedbackSchema = new mongoose.Schema({
  parentEmail: { type: String, required: true },
  childEmail: { type: String, required: true },
  feedback: String,
  rating: { type: Number, default: 0 },
  date: { type: Date, default: Date.now }
});

export default mongoose.model("Feedback", FeedbackSchema);
