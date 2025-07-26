import express from "express";
import { authenticateToken } from "../middleware/authMiddleware";
import {
  getUserProfile,
  updateUserProfile,
  updatePassword,
} from "../controllers/userController";

const router = express.Router();

router.get("/profile", authenticateToken, getUserProfile);
router.put("/update", authenticateToken, updateUserProfile);
router.put("/password", authenticateToken, updatePassword);

export default router;
