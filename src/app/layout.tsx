import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "EventPilot — The Living Plan | Google Prompt Wars Challenge 5",
  description:
    "A GenAI-assisted event-planning workspace that connects budgets, timelines, vendor checklists, and personalized ideas with explainable constraint replanning.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-[#fbfbfd] text-stone-900 antialiased selection:bg-violet-100 selection:text-violet-900">
        {children}
      </body>
    </html>
  );
}

