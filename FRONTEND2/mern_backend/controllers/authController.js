import User from "../models/User.js";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "replace_this_with_strong_secret";

export const register = async (req, res) => {
  try {
    const { name, email, role, age, disability, parentEmail } = req.body;
    if (!name || !email || !role) return res.status(400).json({ error: "Missing fields" });

    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ error: "Email already registered" });

    const user = new User({ name, email, role, age, disability, parentEmail });
    await user.save();

    // issue token so they are "signed in" immediately
    const token = jwt.sign({ email: user.email, role: user.role }, JWT_SECRET, { expiresIn: "7d" });

    return res.json({ message: "Registered", user: { name, email, role }, token });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Server error" });
  }
};

export const login = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ error: "Email required" });

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ error: "User not found. Please register." });

    const token = jwt.sign({ email: user.email, role: user.role }, JWT_SECRET, { expiresIn: "7d" });
    return res.json({ message: "Login success", token, user: { name: user.name, email: user.email, role: user.role } });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Server error" });
  }
};
