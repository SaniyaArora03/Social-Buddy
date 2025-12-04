import Feedback from "../models/Feedback.js";

export const submitFeedback = async (req, res) => {
  try {
    const { parentEmail, childEmail, feedback, rating } = req.body;
    if (!parentEmail || !childEmail) return res.status(400).json({ error: "Missing fields" });

    const doc = new Feedback({ parentEmail, childEmail, feedback, rating });
    await doc.save();
    return res.json({ message: "Feedback saved" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Server error" });
  }
};

export const getFeedback = async (req, res) => {
  try {
    const { childEmail } = req.params;
    const rows = await Feedback.find({ childEmail }).sort({ date: -1 });
    return res.json(rows);
  } catch (err) {
    return res.status(500).json({ error: "Server error" });
  }
};
