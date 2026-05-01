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
  verification: {
    google: '-nPl-t4aXdZbJ2a5TyDeqsQTmAxSHjkfaQkHJqOZHt4',
  },
  openGraph: {
    type: 'website',
    siteName: 'AgentLens',
    locale: 'en_US',
    images: [
      {
        url: '/api/og',
        width: 1200,
        height: 630,
        alt: 'AgentLens — AI Agent Orchestration Visualizer',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    images: [{ url: '/api/og', alt: 'AgentLens — AI Agent Orchestration Visualizer' }],
  },
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
