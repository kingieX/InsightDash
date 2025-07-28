import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-8">
      <h1 className="text-3xl font-bold mb-6">📊 Upload CSV for Insight</h1>
      <h1 className="text-2xl font-semibold">Welcome to InsightDash</h1>
      <Button variant="default">Get Started</Button>
    </main>
  );
}
