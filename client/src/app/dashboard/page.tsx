/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import AOS from "aos";
import "aos/dist/aos.css";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export default function DashboardPage() {
  const router = useRouter();

  const [user, setUser] = useState<any>(null);
  const [stats, setStats] = useState({
    totalInsights: 0,
    totalUploads: 0,
  });
  const [recentInsights, setRecentInsights] = useState<any[]>([]);

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
          `${process.env.NEXT_PUBLIC_API_URL}/api/users/dashboard`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const { user, stats, recentInsights } = res.data;
        setUser(user);
        setStats(stats);
        setRecentInsights(recentInsights);
      } catch (error) {
        console.error(error);
        toast.error("Failed to load dashboard data.");
      }
    };

    fetchDashboardData();
  }, [router]);

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-6">
      <h1 className="text-3xl font-bold" data-aos="fade-up">
        Welcome back{user ? `, ${user.name || user.email}` : ""}!
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        <Card data-aos="fade-up">
          <CardContent className="p-4">
            <h3 className="text-lg font-semibold">Total Insights</h3>
            <p className="text-2xl font-bold">{stats.totalInsights}</p>
          </CardContent>
        </Card>

        <Card data-aos="fade-up" data-aos-delay="100">
          <CardContent className="p-4">
            <h3 className="text-lg font-semibold">Total Uploads</h3>
            <p className="text-2xl font-bold">{stats.totalUploads}</p>
          </CardContent>
        </Card>

        <Card data-aos="fade-up" data-aos-delay="200">
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

      <div className="mt-8 space-y-4">
        <h2 className="text-xl font-semibold" data-aos="fade-up">
          Recent Insights
        </h2>
        {recentInsights.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {recentInsights.map((insight, idx) => (
              <Card
                key={insight.id}
                data-aos="fade-up"
                data-aos-delay={idx * 100}
              >
                <CardContent className="p-4">
                  <h4 className="font-semibold text-base mb-1">
                    {insight.title || `Insight ${insight.id}`}
                  </h4>
                  <p className="text-sm text-muted-foreground mb-2">
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
    </div>
  );
}
