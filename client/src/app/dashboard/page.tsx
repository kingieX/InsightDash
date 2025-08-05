/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import AOS from "aos";
import "aos/dist/aos.css";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

export default function DashboardPage() {
  const router = useRouter();

  const [totalInsights, setTotalInsights] = useState(0);
  const [recentInsights, setRecentInsights] = useState<any[]>([]);
  const [sortOrder, setSortOrder] = useState<"newest" | "oldest">("newest");

  useEffect(() => {
    AOS.init();

    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/auth/signin");
      return;
    }

    const fetchDashboardData = async () => {
      try {
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/user/dashboard`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const { totalInsights, recentInsights } = res.data;
        setTotalInsights(totalInsights);
        setRecentInsights(recentInsights);
      } catch (error) {
        console.error(error);
        toast.error("Failed to load dashboard data.");
      }
    };

    fetchDashboardData();
  }, [router]);

  const sortedInsights = useMemo(() => {
    return [...recentInsights].sort((a, b) => {
      return sortOrder === "newest"
        ? new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        : new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
    });
  }, [recentInsights, sortOrder]);

  const chartData = useMemo(() => {
    const grouped = recentInsights.reduce((acc, item) => {
      const date = new Date(item.createdAt).toLocaleDateString();
      acc[date] = (acc[date] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(grouped).map(([date, count]) => ({
      date,
      count,
    }));
  }, [recentInsights]);

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <h1 className="text-3xl font-bold" data-aos="fade-up">
        Welcome back!
      </h1>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <Card data-aos="fade-up">
          <CardContent className="p-4">
            <h3 className="text-lg font-semibold">Total Insights</h3>
            <p className="text-2xl font-bold">{totalInsights}</p>
          </CardContent>
        </Card>

        <Card data-aos="fade-up" data-aos-delay="100">
          <CardContent className="p-4">
            <h3 className="text-lg font-semibold">Actions</h3>
            <div className="space-y-2 mt-2">
              <Button
                variant="outline"
                className="w-full"
                onClick={() => router.push("/insight")}
              >
                Generate New Insight
              </Button>
              <Button
                variant="outline"
                className="w-full"
                onClick={() => router.push("/insights")}
              >
                View Insights
              </Button>
              <Button
                variant="outline"
                className="w-full"
                onClick={() => router.push("/profile")}
              >
                Edit Profile
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Chart Section */}
      <div data-aos="fade-up" className="w-full">
        <h2 className="text-xl font-semibold mb-4">Insights Over Time</h2>
        {chartData.length > 0 ? (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Line type="monotone" dataKey="count" stroke="#3b82f6" />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <p className="text-sm text-muted-foreground">No chart data yet.</p>
        )}
      </div>

      {/* Filters */}
      <div className="flex justify-between items-center mt-10">
        <h2 className="text-xl font-semibold">Recent Insights</h2>
        <select
          value={sortOrder}
          onChange={(e) => setSortOrder(e.target.value as "newest" | "oldest")}
          className="border rounded px-2 py-1 text-sm"
        >
          <option value="newest">Sort: Newest First</option>
          <option value="oldest">Sort: Oldest First</option>
        </select>
      </div>

      {/* Recent Insights */}
      {sortedInsights.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {sortedInsights.map((insight, idx) => (
            <Card
              key={insight.id}
              data-aos="fade-up"
              data-aos-delay={idx * 100}
            >
              <CardContent className="p-4">
                <h4 className="font-semibold text-base mb-1">
                  {`Insight ${idx + 1}`}
                </h4>
                {/* <p className="text-xs text-muted-foreground mb-2 italic">
                  Size: {insight.size ? `${insight.size} KB` : "Unknown"} | Tag:
                  CSV
                </p> */}

                <div className="prose dark:prose-invert text-sm line-clamp-3 mb-2 max-w-none">
                  <ReactMarkdown rehypePlugins={[rehypeRaw]}>
                    {insight.summary || "No summary available."}
                  </ReactMarkdown>
                </div>
                <p className="text-sm text-muted-foreground mb-1">
                  {new Date(insight.createdAt).toLocaleString()}
                </p>

                <Button
                  size="sm"
                  onClick={() => router.push(`/insights/${insight.id}`)}
                >
                  View Insight
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <p className="text-sm text-muted-foreground" data-aos="fade-up">
          No insights yet. Upload a CSV to generate one.
        </p>
      )}
    </div>
  );
}
