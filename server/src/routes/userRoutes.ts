import express from "express";
import { authenticateToken } from "../middleware/authMiddleware";
import {
  getUserProfile,
  updateUserProfile,
  updatePassword,
  getDashboard,
} from "../controllers/userController";

const router = express.Router();

router.get("/profile", authenticateToken, getUserProfile);
router.put("/update", authenticateToken, updateUserProfile);
router.put("/password", authenticateToken, updatePassword);
router.get("/dashboard", authenticateToken, getDashboard);

export default router;
