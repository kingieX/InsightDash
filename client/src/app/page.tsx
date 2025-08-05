// app/page.tsx
"use client";

import { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  MdUploadFile,
  MdDashboardCustomize,
  MdAnalytics,
} from "react-icons/md";

export default function HomePage() {
  useEffect(() => {
    AOS.init({ duration: 1000 });
  }, []);

  return (
    <section className="px-6 py-12 max-w-7xl mx-auto">
      {/* Hero Section */}
      <div className="text-center space-y-6 mb-16" data-aos="fade-up">
        <h1 className="text-4xl md:text-5xl font-bold">
          Uncover Powerful Insights from Your Data
        </h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          InsightDash uses AI to help you turn CSV files into clear, actionable
          insights. No data science background required.
        </p>
        <div className="flex justify-center gap-4">
          <Link href="/insight">
            <Button size="lg">Generate Insight</Button>
          </Link>
          <Link href="/dashboard">
            <Button size="lg" variant="outline">
              Try Dashboard
            </Button>
          </Link>
        </div>
      </div>

      {/* Features */}
      <div
        className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16"
        data-aos="fade-up"
      >
        <FeatureCard
          icon={<MdUploadFile size={28} />}
          title="Easy CSV Uploads"
          description="Upload your datasets seamlessly with secure handling."
        />
        <FeatureCard
          icon={<MdAnalytics size={28} />}
          title="AI-Generated Insights"
          description="Let AI analyze your data and summarize trends, anomalies, and more."
        />
        <FeatureCard
          icon={<MdDashboardCustomize size={28} />}
          title="Intuitive Dashboard"
          description="Access all your insights in one organized and user-friendly place."
        />
      </div>

      {/* How it Works */}
      <div className="mb-16 space-y-8" data-aos="fade-up">
        <h2 className="text-2xl font-bold text-center">How It Works</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <StepCard
            step="1"
            title="Upload Your CSV"
            description="Drag and drop or select a CSV file to get started."
          />
          <StepCard
            step="2"
            title="AI Analyzes It"
            description="AI processes the data and finds insights instantly."
          />
          <StepCard
            step="3"
            title="View Results"
            description="Access insights from your personal dashboard."
          />
        </div>
      </div>

      {/* Final CTA */}
      <div className="text-center space-y-4" data-aos="zoom-in">
        <h3 className="text-xl font-semibold">
          Ready to make sense of your data?
        </h3>
        <Link href="/insight">
          <Button size="lg">Get Started</Button>
        </Link>
      </div>
    </section>
  );
}

function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div
      className="p-6 border border-border rounded-2xl shadow-sm bg-card"
      data-aos="fade-up"
    >
      <div className="text-primary mb-4">{icon}</div>
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      <p className="text-sm text-muted-foreground">{description}</p>
    </div>
  );
}

function StepCard({
  step,
  title,
  description,
}: {
  step: string;
  title: string;
  description: string;
}) {
  return (
    <div
      className="p-6 border border-border rounded-xl bg-muted/20"
      data-aos="fade-up"
    >
      <div className="text-3xl font-bold text-primary mb-2">{step}</div>
      <h4 className="text-lg font-semibold mb-1">{title}</h4>
      <p className="text-sm text-muted-foreground">{description}</p>
    </div>
  );
}
