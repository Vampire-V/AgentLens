import type { Metadata } from "next";
import { Geist_Mono, Geist } from "next/font/google";
import { NuqsAdapter } from "nuqs/adapters/next/app";
import { ThemeProvider } from "next-themes";
import "./globals.css";
import { cn } from "@/lib/utils";

const geist = Geist({subsets:['latin'],variable:'--font-sans'});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ?? 'https://agent-lens-murex.vercel.app'
  ),
  title: {
    default: 'AgentLens — AI Agent Orchestration Visualizer',
    template: '%s | AgentLens',
  },
  description:
    'Free online tool to visualize AI agent workflows as interactive graphs. Supports CrewAI, LangGraph, AutoGen YAML. Real-time parsing + auto-layout.',
  keywords: [
    'AI agent orchestration',
    'YAML visualizer',
    'CrewAI visualizer',
    'LangGraph diagram',
    'agentic workflow',
    'AI agent diagram',
    'multi-agent workflow tool',
    'AI agent orchestration visualizer',
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className={cn("h-full", "antialiased", geistMono.variable, "font-sans", geist.variable)}>
      <body className="h-full">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <NuqsAdapter>{children}</NuqsAdapter>
        </ThemeProvider>
      </body>
    </html>
  );
}
