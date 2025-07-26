// src/controllers/insightController.ts
import { Request, Response } from "express";
import csv from "csvtojson";
import prisma from "../../prisma/client";
import { getInsightsFromGemini } from "../services/geminiService";

export const uploadAndGenerateInsight = async (req: Request, res: Response) => {
  try {
    const file = req.file;

    if (!file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const csvString = file.buffer.toString("utf-8");
    const jsonData = await csv().fromString(csvString);

    const insight = await getInsightsFromGemini(jsonData);

    // @ts-ignore - added in auth middleware
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ error: "Unauthorized" });

    const savedInsight = await prisma.insight.create({
      data: {
        userId,
        filename: file.originalname,
        data: JSON.stringify(jsonData),
        insight,
        createdAt: new Date(),
      },
    });

    res.status(201).json({ message: "Insight saved", insight: savedInsight });
  } catch (err) {
    console.error("Upload & Generate Error:", err);
    res.status(500).json({ error: "Failed to process file and save insight." });
  }
};
