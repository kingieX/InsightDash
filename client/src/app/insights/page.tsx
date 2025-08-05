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
import { Trash2 } from "lucide-react";

export default function InsightsPage() {
  const router = useRouter();

  const [allInsights, setAllInsights] = useState<any[]>([]);
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
          `${process.env.NEXT_PUBLIC_API_URL}/api/insights`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        // Fix: unwrap the insights array from the response
        const fetchedInsights = res.data.insights;
        setAllInsights(fetchedInsights || []);
        console.log("Fetched insights:", fetchedInsights);
      } catch (error) {
        console.error(error);
        toast.error("Failed to load insights.");
      }
    };

    fetchDashboardData();
  }, [router]);

  const sortedInsights = useMemo(() => {
    return [...allInsights].sort((a, b) => {
      return sortOrder === "newest"
        ? new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        : new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
    });
  }, [allInsights, sortOrder]);

  // function to delete insight
  const handleDelete = async (id: string) => {
    const confirm = window.confirm(
      "Are you sure you want to delete this insight?"
    );
    if (!confirm) return;

    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("You must be logged in to delete insights.");
      router.push("/auth/signin");
      return;
    }

    try {
      await axios.delete(
        `${process.env.NEXT_PUBLIC_API_URL}/api/insights/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Update state
      setAllInsights((prev) => prev.filter((insight) => insight.id !== id));
      toast.success("Insight deleted successfully.");
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete insight.");
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      {/* Filters */}
      <div className="flex justify-between items-center mt-10">
        <h2 className="text-xl font-semibold">All Insights</h2>
        <select
          value={sortOrder}
          onChange={(e) => setSortOrder(e.target.value as "newest" | "oldest")}
          className="border rounded px-2 py-1 text-sm"
        >
          <option value="newest">Sort: Newest First</option>
          <option value="oldest">Sort: Oldest First</option>
        </select>
      </div>

      {/* Insights List */}
      {sortedInsights.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {sortedInsights.map((insight, idx) => (
            <Card
              key={insight.id}
              data-aos="fade-up"
              data-aos-delay={idx * 100}
            >
              <CardContent className="p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-semibold text-base mb-1">
                      {`Insight ${idx + 1}`}
                    </h4>

                    {/* <p className="text-xs text-muted-foreground mb-2 italic">
                      Size: {insight.size ? `${insight.size} KB` : "Unknown"} |
                      Tag: CSV
                    </p> */}
                  </div>
                  {/* Delete Icon */}
                  <Trash2
                    className="w-4 h-4 text-red-500 cursor-pointer hover:text-red-700"
                    onClick={() => handleDelete(insight.id)}
                  />
                </div>

                <div className="prose dark:prose-invert text-sm line-clamp-3 mb-2 max-w-none">
                  <ReactMarkdown rehypePlugins={[rehypeRaw]}>
                    {typeof insight.insight === "string"
                      ? "..." + insight.insight.slice(200, 700) + "..."
                      : "No summary available."}
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
