import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";

dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY as string);

export const getInsightsFromGemini = async (jsonData: any) => {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    const prompt = `
You are a data analyst.

Given the following financial dataset in JSON format, perform the following:

1. Analyze and summarize trends, anomalies, and patterns in human-readable format (markdown-compatible).
2. Provide actionable recommendations based on the analysis.
3. Additionally, return structured chart data for visualizations:
   - Examples: Salary by Department, Age vs Salary, or any other relevant metric you find.
   - Format the chart data as JSON with keys like "departmentSalary", "ageSalary", etc.

Return your response in this format:

{
  "summary": "A markdown-formatted explanation with trends and insights...",
  "chartData": {
    "departmentSalary": [
      { "department": "Sales", "salary": 50000 },
      { "department": "Engineering", "salary": 75000 }
    ],
    "ageSalary": [
      { "age": 28, "salary": 50000 },
      { "age": 34, "salary": 75000 }
    ]
  }
}

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
