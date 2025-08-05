/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

export default function InsightPage() {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [summary, setSummary] = useState<string | null>(null);
  const [chartData, setChartData] = useState<any | null>(null);

  const router = useRouter();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    setFile(selected || null);
  };

  const handleUploadAndGenerateInsight = async () => {
    if (!file) {
      toast.error("Please select a CSV file.");
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/auth/signin");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      setUploading(true);

      // Step 1: Upload and parse CSV
      const uploadRes = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/upload`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const parsedData = uploadRes.data.data;
      toast.success("CSV uploaded and parsed successfully.");

      // Step 2: Send parsed JSON to generate insights
      const insightRes = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/insights/insight`,
        { data: parsedData },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const insight = insightRes.data.savedInsight.insight;
      if (!insight) {
        throw new Error("No insight generated.");
      }
      // console.log("Insight data:", insight);

      // Remove markdown code block formatting before parsing
      const cleanedInsight = insight.replace(/^```json\s*|\s*```$/g, "");
      const parsedInsight = JSON.parse(cleanedInsight);

      setSummary(parsedInsight.summary);
      setChartData(parsedInsight.chartData);

      toast.success("Insight generated successfully.");
    } catch (error: any) {
      console.error(error);
      if (error.response?.status === 401) {
        router.push("/auth/signin");
      } else {
        toast.error("Failed to upload or generate insights.");
      }
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-4 space-y-6">
      <h1 className="text-2xl font-bold">Upload CSV & Generate Insight</h1>

      <Card>
        <CardContent className="p-4 space-y-4">
          <Input type="file" accept=".csv" onChange={handleFileChange} />
          <Button onClick={handleUploadAndGenerateInsight} disabled={uploading}>
            {uploading ? "Processing..." : "Upload & Generate Insight"}
          </Button>
        </CardContent>
      </Card>

      {summary && (
        <Card>
          <CardContent className="p-4 space-y-4">
            <h2 className="font-semibold text-xl mb-2">Generated Insight</h2>

            <div className="prose dark:prose-invert max-w-none text-sm">
              <ReactMarkdown rehypePlugins={[rehypeRaw]}>
                {summary}
              </ReactMarkdown>
            </div>
          </CardContent>
        </Card>
      )}

      {chartData && (
        <div className="space-y-8">
          {chartData.departmentSalary && (
            <Card>
              <CardContent className="p-4">
                <h3 className="font-semibold mb-2">Salary by Department</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={chartData.departmentSalary}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="department" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="salary" fill="#4f46e5" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          )}

          {chartData.ageSalary && (
            <Card>
              <CardContent className="p-4">
                <h3 className="font-semibold mb-2">Salary by Age</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={chartData.ageSalary}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="age" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="salary" fill="#059669" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </div>
  );
}
