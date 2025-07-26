import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";

dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY as string);

export const getInsightsFromGemini = async (jsonData: any) => {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    const prompt = `
      You are a data analyst. Based on the following financial data in JSON format,
      extract and summarize insights such as trends, anomalies, and recommendations.

      Data:
      ${JSON.stringify(jsonData, null, 2)}
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response.text();

    return response;
  } catch (err) {
    console.error("Gemini API error:", err);
    return "Failed to generate insights from Gemini.";
  }
};
