import { Router } from "express";
import { login, signup, validateSignup } from "../controllers/authController";

const router = Router();

router.post("/signup", validateSignup, signup);
router.post("/login", login);

export default router;
