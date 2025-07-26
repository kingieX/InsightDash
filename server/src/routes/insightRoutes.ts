import express from "express";
import {
  deleteInsight,
  generateInsight,
  getAllInsights,
  getInsightById,
} from "../controllers/insightController";
import { authenticateToken } from "../middleware/authMiddleware";
// import { verifyToken } from "../utils/jwt";

const router = express.Router();

router.post("/insight", authenticateToken, generateInsight); // POST /api/insights/insight
router.get("/", authenticateToken, getAllInsights); // GET /api/insights/
router.get("/:id", authenticateToken, getInsightById); // GET /api/insights/:id
router.delete("/:id", authenticateToken, deleteInsight); // DELETE /api/insights/:id

export default router;
