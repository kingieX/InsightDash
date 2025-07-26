import express from "express";
import { upload } from "../middleware/multerMiddleware";
import { handleCSVUpload } from "../controllers/uploadController";
import { authenticateToken } from "../middleware/authMiddleware";

const router = express.Router();

router.post("/", authenticateToken, upload.single("file"), handleCSVUpload);

export default router;
