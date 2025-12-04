import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import { connectDB } from "./config/db.js";
import authRoutes from "./routes/auth.js";
import userRoutes from "./routes/users.js";
import feedbackRoutes from "./routes/feedback.js";

const app = express();
connectDB();

app.use(cors({ origin: true }));
app.use(bodyParser.json({ limit: "5mb" }));

app.use("/auth", authRoutes);
app.use("/users", userRoutes);
app.use("/feedback", feedbackRoutes);

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`Auth server running on ${PORT}`));
