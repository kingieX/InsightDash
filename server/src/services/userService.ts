const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

interface ParsedInsight {
  summary?: string;
  chartData?: Record<string, unknown>;
  [key: string]: unknown;
}

interface RecentInsight {
  id: number;
  filename: string;
  createdAt: Date;
  summary: string;
}

interface DashboardData {
  totalInsights: number;
  recentInsights: RecentInsight[];
}

const getDashboardData = async (userId: number): Promise<DashboardData> => {
  // Total insights
  const totalInsights: number = await prisma.insight.count({
    where: { userId },
  });

  // Recent 5 insights
  const recentInsightsRaw: Array<{
    id: number;
    createdAt: Date;
    filename: string;
    insight: string;
  }> = await prisma.insight.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    take: 5,
    select: {
      id: true,
      createdAt: true,
      filename: true,
      insight: true, // JSON string
    },
  });

  // Parse the JSON insight field
  const recentInsights: RecentInsight[] = recentInsightsRaw.map((item) => {
    let parsedInsight: ParsedInsight = {};
    try {
      const cleanedInsight = item.insight.replace(/^```json\s*|\s*```$/g, "");
      parsedInsight = JSON.parse(cleanedInsight);
    } catch (e) {
      parsedInsight = { summary: "Invalid JSON", chartData: {} };
    }

    return {
      id: item.id,
      filename: item.filename,
      createdAt: item.createdAt,
      summary: parsedInsight.summary || "No summary available",
    };
  });

  return {
    totalInsights,
    recentInsights,
  };
};

module.exports = {
  getDashboardData,
};
