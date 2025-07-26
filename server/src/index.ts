import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import insightRouter from "./routes/insightRoutes";
import uploadRouter from "./routes/uploadRoute";
import authRoutes from "./routes/authRoutes";
import userRoutes from "./routes/userRoutes";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json({ limit: "10mb" }));

// Route for handling CSV & AI
app.use("/api/upload", uploadRouter);
// Route for handling authentication
app.use("/api/auth", authRoutes);
// Route to handle insights (GET all, GET by ID, POST, DELETE)
app.use("/api/insights", insightRouter);
// Route for user profile management
app.use("/user", userRoutes);

app.get("/", (_req, res) => {
  res.send("InsightDash Backend Running ✅");
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
