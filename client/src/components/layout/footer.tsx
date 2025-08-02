import Link from "next/link";
import { MdInsights } from "react-icons/md";

export function Footer() {
  return (
    <footer className="border-t border-border bg-background text-muted-foreground mt-12">
      <div className="max-w-7xl mx-auto px-6 py-8 flex flex-col md:flex-row items-center justify-between gap-4 text-sm">
        <div className="flex items-center gap-2">
          © {new Date().getFullYear()}{" "}
          <span className="flex items-center gap-1">
            <MdInsights size={16} /> InsightDash.
          </span>{" "}
          All rights reserved.
        </div>
        <div className="flex gap-4">
          <Link href="/privacy" className="hover:text-foreground">
            Privacy
          </Link>
          <Link href="/terms" className="hover:text-foreground">
            Terms
          </Link>
          <Link href="/contact" className="hover:text-foreground">
            Contact
          </Link>
        </div>
      </div>
    </footer>
  );
}
