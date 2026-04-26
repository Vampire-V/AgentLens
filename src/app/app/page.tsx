import type { Metadata } from 'next'
import { Suspense } from 'react'
import Link from 'next/link'
import LZString from 'lz-string'
import { SplitPane } from '@/components/split-pane'
import { DEFAULT_YAML } from '@/lib/default-yaml'
import { extractWorkflowMeta } from '@/app/api/og/extract-workflow-meta'

export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<{ yaml?: string }>
}): Promise<Metadata> {
  const { yaml } = await searchParams
  const compressed = yaml ?? LZString.compressToEncodedURIComponent(DEFAULT_YAML)
  const meta =
    extractWorkflowMeta(compressed) ??
    extractWorkflowMeta(LZString.compressToEncodedURIComponent(DEFAULT_YAML))!
  const ogUrl = `/api/og?name=${encodeURIComponent(meta.name)}&agents=${meta.agentCount}&routes=${meta.routeCount}`
  return {
    openGraph: {
      title: 'AgentLens',
      description: 'Visual YAML editor for AI agent orchestration workflows',
      images: [{ url: ogUrl, width: 1200, height: 630, alt: 'AgentLens workflow preview' }],
    },
    twitter: {
      card: 'summary_large_image',
      title: 'AgentLens',
      description: 'Visual YAML editor for AI agent orchestration workflows',
      images: [ogUrl],
    },
    robots: { index: false, follow: false },
  }
}

export default function AppPage() {
  return (
    <main className="flex h-full flex-col">
      <header className="flex items-center border-b border-border bg-background px-4 py-2">
        <Link href="/" className="text-sm font-semibold text-foreground hover:underline">
          AgentLens
        </Link>
        <span className="ml-2 text-xs text-muted-foreground">YAML → Graph</span>
      </header>
      <div className="flex-1 overflow-hidden">
        <Suspense>
          <SplitPane />
        </Suspense>
      </div>
    </main>
  )
}
