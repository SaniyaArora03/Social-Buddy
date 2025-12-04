import express from "express";
import { getChildren, getProfile } from "../controllers/userController.js";

const router = express.Router();

router.get("/children/:parentEmail", getChildren);
router.get("/profile/:email", getProfile);

export default router;
