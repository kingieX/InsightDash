/* eslint-disable @typescript-eslint/no-require-imports */
// tailwind.config.ts
import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class", // required for your `.dark` theme overrides
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-sans)", "sans-serif"],
        mono: ["var(--font-mono)", "monospace"],
      },
      borderRadius: {
        sm: "var(--radius-sm)",
        md: "var(--radius-md)",
        lg: "var(--radius-lg)",
        xl: "var(--radius-xl)",
      },
      colors: {
        background: "var(--color-background)",
        foreground: "var(--color-foreground)",
        primary: "var(--color-primary)",
        secondary: "var(--color-secondary)",
        muted: "var(--color-muted)",
        border: "var(--color-border)",
        ring: "var(--color-ring)",
        card: "var(--color-card)",
        input: "var(--color-input)",
        destructive: "var(--color-destructive)",
        sidebar: "var(--color-sidebar)",
      },
    },
  },
  plugins: [require("tw-animate-css")],
};

export default config;
