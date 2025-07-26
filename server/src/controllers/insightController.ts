import { Request, Response } from "express";
import { getInsightsFromGemini } from "../services/geminiService";
import prisma from "../../prisma/client";

interface AuthRequest extends Request {
  userId?: string;
}

// This function generates insights based on the provided data
export const generateInsight = async (req: Request, res: Response) => {
  try {
    const { data } = req.body;

    if (!data || !Array.isArray(data)) {
      return res.status(400).json({ error: "Invalid or missing data array." });
    }

    // generate insight from Gemini
    const insight = await getInsightsFromGemini(data);

    // @ts-ignore - user info should be attached by middleware
    // const userId = req.user?.id;
    const userId = req.userId;
    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    // save insight to DB
    const savedInsight = await prisma.insight.create({
      data: {
        userId,
        insight: insight, // assuming `insight` is a string
        filename: "you cannot access it...", // or provide a real filename if available
        data: JSON.stringify(data), // store original data
        createdAt: new Date(),
      },
    });

    res.status(200).json({ savedInsight });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to generate insight." });
  }
};

// Fetch all insights for the authenticated user
export const getAllInsights = async (req: AuthRequest, res: Response) => {
  const userId = req.userId;
  // console.log("User ID from request:", userId);

  if (!userId) {
    return res.status(401).json({ error: "Unauthorized access." });
  }
  try {
    const insights = await prisma.insight.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
    });
    res.json({ insights });
    // console.log("Fetched Insights:", insights);
  } catch (err) {
    console.error("Get All Insights Error:", err);
    res.status(500).json({ error: "Failed to fetch insights" });
  }
};

// Fetch a single insight by ID
export const getInsightById = async (req: AuthRequest, res: Response) => {
  const userId = req.userId;
  if (!userId) {
    return res.status(401).json({ error: "Unauthorized access." });
  }
  const { id } = req.params;
  if (!id) {
    return res.status(400).json({ error: "Insight ID is required." });
  }
  try {
    const insight = await prisma.insight.findUnique({
      where: { id },
    });

    if (!insight || insight.userId !== userId) {
      return res.status(404).json({ error: "Insight not found" });
    }

    res.json({ insight });
  } catch (err) {
    console.error("Get Insight Error:", err);
    res.status(500).json({ error: "Failed to fetch insight" });
  }
};

// Delete an insight by ID
export const deleteInsight = async (req: AuthRequest, res: Response) => {
  const userId = req.userId;
  if (!userId) {
    return res.status(401).json({ error: "Unauthorized access." });
  }
  const { id } = req.params;
  if (!id) {
    return res.status(400).json({ error: "Insight ID is required." });
  }
  try {
    const insight = await prisma.insight.findUnique({
      where: { id },
    });

    if (!insight || insight.userId !== userId) {
      return res.status(404).json({ error: "Insight not found" });
    }

    await prisma.insight.delete({ where: { id } });

    res.json({ message: "Insight deleted successfully" });
  } catch (err) {
    console.error("Delete Insight Error:", err);
    res.status(500).json({ error: "Failed to delete insight" });
  }
};
