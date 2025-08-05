/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import axios from "axios";
import { toast } from "sonner";
import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import AOS from "aos";
import "aos/dist/aos.css";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function InsightDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [insight, setInsight] = useState<any>(null);

  useEffect(() => {
    AOS.init();

    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/auth/signin");
      return;
    }

    const fetchInsight = async () => {
      try {
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/api/insights/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = res.data.insight;

        // Clean and parse the JSON string
        const cleanedString = data.insight
          .replace(/^```json/, "")
          .replace(/^```/, "")
          .replace(/```$/, "")
          .trim();

        const parsedInsight = JSON.parse(cleanedString);

        setInsight({
          ...data,
          parsed: parsedInsight, // includes summary and chartData
        });
      } catch (error) {
        console.error("Failed to parse insight:", error);
        toast.error("Failed to load insight.");
      } finally {
        setLoading(false);
      }
    };

    fetchInsight();
  }, [id, router]);

  if (loading) return <p className="text-center mt-10">Loading insight...</p>;

  if (!insight) return <p className="text-center mt-10">Insight not found.</p>;

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between" data-aos="fade-up">
        <h1 className="text-2xl font-bold">Insight Details</h1>
        <Button variant="outline" onClick={() => router.push("/dashboard")}>
          ← Back to Dashboard
        </Button>
      </div>

      <Card data-aos="fade-up">
        <CardContent className="px-4">
          {/* <h2 className="text-xl font-semibold">Insight Summary</h2> */}
          <p className="text-sm text-muted-foreground">
            Created at: {new Date(insight.createdAt).toLocaleString()}
          </p>
        </CardContent>
      </Card>

      <div data-aos="fade-up">
        <h3 className="text-lg font-semibold mb-2">Insight Summary</h3>
        <div className="prose dark:prose-invert max-w-none">
          <ReactMarkdown rehypePlugins={[rehypeRaw]}>
            {insight.parsed?.summary || "No summary available."}
          </ReactMarkdown>
        </div>
      </div>

      {insight.parsed?.chartData && (
        <div data-aos="fade-up" className="space-y-6">
          <h3 className="text-lg font-semibold">Charts</h3>

          <Card data-aos="fade-up">
            <CardContent className="p-4">
              <h4 className="font-semibold mb-2">Department vs Salary</h4>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={insight.parsed.chartData.departmentSalary}>
                  <XAxis dataKey="department" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="salary" fill="#00C49F" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card data-aos="fade-up" data-aos-delay={100}>
            <CardContent className="p-4">
              <h4 className="font-semibold mb-2">Age vs Salary</h4>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={insight.parsed.chartData.ageSalary}>
                  <XAxis dataKey="age" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="salary" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
