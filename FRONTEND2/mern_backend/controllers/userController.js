import User from "../models/User.js";

export const getChildren = async (req, res) => {
  try {
    const { parentEmail } = req.params;
    const children = await User.find({ parentEmail });
    return res.json(children || []);
  } catch (err) {
    return res.status(500).json({ error: "Server error" });
  }
};

export const getProfile = async (req, res) => {
  try {
    const { email } = req.params;
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ error: "Not found" });
    return res.json(user);
  } catch (err) {
    return res.status(500).json({ error: "Server error" });
  }
};
