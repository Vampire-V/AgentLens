import type { Metadata } from 'next';
import Link from 'next/link';
import { getGuide } from '@/lib/guides';
import { buildPageMetadata, buildOgImageUrl, SITE_URL } from '@/lib/seo';

const guide = getGuide('visualize-crewai');

export const metadata: Metadata = {
  title: guide.title,
  description: guide.description,
  ...buildPageMetadata({
    title: guide.title,
    description: guide.description,
    path: `/guides/${guide.slug}`,
    ogImageUrl: buildOgImageUrl({ type: 'guide', title: guide.title, framework: guide.framework }),
    ogImageAlt: `${guide.title} — AgentLens`,
    ogType: 'article',
    article: { publishedTime: guide.datePublished, modifiedTime: guide.lastModified },
  }),
};

const articleSchema = {
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: guide.title,
  description: guide.description,
  url: `${SITE_URL}/guides/${guide.slug}`,
  image: buildOgImageUrl({ type: 'guide', title: guide.title, framework: guide.framework }),
  datePublished: guide.datePublished,
  dateModified: guide.lastModified,
  mainEntityOfPage: { '@type': 'WebPage', '@id': `${SITE_URL}/guides/${guide.slug}` },
  author: { '@type': 'Organization', name: 'AgentLens' },
  publisher: {
    '@type': 'Organization',
    name: 'AgentLens',
    logo: { '@type': 'ImageObject', url: `${SITE_URL}/favicon.ico`, width: 48, height: 48 },
  },
};

const breadcrumbSchema = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
    { '@type': 'ListItem', position: 2, name: 'Guides', item: `${SITE_URL}/guides` },
    { '@type': 'ListItem', position: 3, name: guide.title, item: `${SITE_URL}/guides/${guide.slug}` },
  ],
};

const CREWAI_YAML = `version: "1.0.0"
name: "CrewAI Research Pipeline"
agents:
  - id: crew_manager
    name: "Crew Manager"
    model: opus
    tools: [TaskAssignment, Coordination]
    description: "Orchestrates the research crew and assigns tasks"
  - id: web_researcher
    name: "Web Researcher"
    model: sonnet
    tools: [WebSearch, BrowserTool]
    description: "Searches the web for relevant information"
  - id: data_analyst
    name: "Data Analyst"
    model: sonnet
    tools: [DataAnalysis, ChartGenerator]
    description: "Analyzes collected data and generates insights"
  - id: writer
    name: "Content Writer"
    model: haiku
    tools: [ContentGeneration]
    description: "Writes the final report from analyzed data"
routes:
  - id: r1
    source: crew_manager
    target: web_researcher
    label: "Assign research task"
  - id: r2
    source: web_researcher
    target: data_analyst
    label: "Pass raw data"
  - id: r3
    source: data_analyst
    target: writer
    label: "Pass insights"
  - id: r4
    source: writer
    target: crew_manager
    label: "Submit report"`;

export default function VisualizeCrewAIPage() {
  return (
    <>
      {/* static server-side objects — safe for dangerouslySetInnerHTML */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6">
          <Link href="/" className="text-lg font-bold tracking-tight">
            AgentLens
          </Link>
          <a
            href="/app"
            className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
          >
            Open Editor →
          </a>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
        <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
          CrewAI
        </p>

        <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
          How to Visualize Your CrewAI Workflow
        </h1>

        <p className="mt-6 text-lg text-muted-foreground">
          CrewAI is a popular multi-agent orchestration framework that lets you
          build teams of AI agents with defined roles, tools, and handoff
          routes. As your crew grows more complex, understanding who hands off
          to whom — and why — becomes increasingly difficult from code alone. A{' '}
          <strong className="text-foreground">CrewAI visualizer</strong> like
          AgentLens turns your agent configuration into an interactive graph,
          making it easy to audit routes, spot unreachable agents, and share
          your architecture with teammates in seconds.
        </p>

        <section className="mt-12">
          <h2 className="text-2xl font-bold tracking-tight text-foreground">
            What You&apos;ll Need
          </h2>
          <ul className="mt-4 list-disc space-y-2 pl-6 text-muted-foreground">
            <li>
              <strong className="text-foreground">AgentLens</strong> — free,
              no login required, runs entirely in your browser
            </li>
            <li>
              <strong className="text-foreground">
                Your CrewAI YAML config
              </strong>{' '}
              — or use the example below to try it out immediately
            </li>
          </ul>
        </section>

        <section className="mt-12">
          <h2 className="text-2xl font-bold tracking-tight text-foreground">
            Step 1 — Write Your CrewAI YAML
          </h2>
          <p className="mt-4 text-muted-foreground">
            AgentLens uses a straightforward YAML schema. A workflow file has
            two top-level keys: <code className="rounded bg-muted px-1 py-0.5 text-sm text-foreground">agents</code> and{' '}
            <code className="rounded bg-muted px-1 py-0.5 text-sm text-foreground">routes</code>.
          </p>
          <p className="mt-3 text-muted-foreground">
            Each agent requires an <code className="rounded bg-muted px-1 py-0.5 text-sm text-foreground">id</code> (no
            spaces), a <code className="rounded bg-muted px-1 py-0.5 text-sm text-foreground">name</code>, and optionally
            a <code className="rounded bg-muted px-1 py-0.5 text-sm text-foreground">model</code> (common values:{' '}
            <code className="rounded bg-muted px-1 py-0.5 text-sm text-foreground">opus</code>,{' '}
            <code className="rounded bg-muted px-1 py-0.5 text-sm text-foreground">sonnet</code>,{' '}
            <code className="rounded bg-muted px-1 py-0.5 text-sm text-foreground">haiku</code>) and a list of{' '}
            <code className="rounded bg-muted px-1 py-0.5 text-sm text-foreground">tools</code>. Each route
            requires an <code className="rounded bg-muted px-1 py-0.5 text-sm text-foreground">id</code>,{' '}
            <code className="rounded bg-muted px-1 py-0.5 text-sm text-foreground">source</code>,{' '}
            <code className="rounded bg-muted px-1 py-0.5 text-sm text-foreground">target</code>, and a{' '}
            <code className="rounded bg-muted px-1 py-0.5 text-sm text-foreground">label</code> describing
            the handoff. An optional{' '}
            <code className="rounded bg-muted px-1 py-0.5 text-sm text-foreground">condition</code> field
            annotates branching logic.
          </p>
          <p className="mt-3 text-muted-foreground">
            Here is a complete example modelling a four-agent CrewAI research
            pipeline:
          </p>
          <pre className="mt-4 overflow-x-auto rounded-xl bg-zinc-900 p-5 text-sm text-zinc-100">
            <code>{CREWAI_YAML}</code>
          </pre>
        </section>

        <section className="mt-12">
          <h2 className="text-2xl font-bold tracking-tight text-foreground">
            Step 2 — Paste into AgentLens
          </h2>
          <p className="mt-4 text-muted-foreground">
            Open AgentLens by clicking the button below. You will see a
            split-pane editor: paste your YAML into the left panel. The graph
            on the right updates automatically within 150 ms — no save button,
            no page reload. The layout engine arranges nodes and edges so
            nothing overlaps.
          </p>
        </section>

        <section className="mt-12">
          <h2 className="text-2xl font-bold tracking-tight text-foreground">
            Step 3 — Read the Graph
          </h2>
          <p className="mt-4 text-muted-foreground">
            Each box in the canvas represents one agent from your{' '}
            <code className="rounded bg-muted px-1 py-0.5 text-sm text-foreground">agents</code> list.
            The arrows between boxes correspond to your{' '}
            <code className="rounded bg-muted px-1 py-0.5 text-sm text-foreground">routes</code>, with
            the <code className="rounded bg-muted px-1 py-0.5 text-sm text-foreground">label</code> value
            shown on each edge. Node color indicates the assigned model — making
            it easy to spot which agents use your most capable (and most
            expensive) models. Click any node to open the inspector panel and
            see the full agent configuration.
          </p>
        </section>

        <div className="mt-12">
          <a
            href="/app"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block rounded-lg bg-primary px-8 py-4 text-base font-semibold text-primary-foreground transition-opacity hover:opacity-90"
          >
            Try this CrewAI template →
          </a>
        </div>

        <section className="mt-16 border-t border-border pt-10">
          <h2 className="text-xl font-bold tracking-tight text-foreground">
            Related Guides
          </h2>
          <ul className="mt-4 space-y-2 text-muted-foreground">
            <li>
              <a
                href="/guides/visualize-langgraph"
                className="font-medium text-foreground underline underline-offset-4 hover:text-muted-foreground"
              >
                How to Visualize LangGraph Agent Graphs →
              </a>
            </li>
            <li>
              <a
                href="/guides"
                className="font-medium text-foreground underline underline-offset-4 hover:text-muted-foreground"
              >
                All Integration Guides →
              </a>
            </li>
          </ul>
        </section>
      </main>

      <footer className="border-t border-border py-10">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="flex flex-col items-center justify-between gap-6 text-sm text-muted-foreground md:flex-row">
            <div className="flex items-center gap-2">
              <span className="font-bold text-foreground">AgentLens</span>
              <span className="rounded-full border border-border px-2 py-0.5 text-xs">
                v0.8.0
              </span>
            </div>
            <p className="max-w-sm text-center text-xs leading-relaxed">
              No YAML data is sent to our servers. All processing happens in
              your browser.
            </p>
            <div>
              <a
                href="#"
                className="text-xs hover:text-foreground"
                aria-label="Follow AgentLens on X (formerly Twitter)"
              >
                Follow on X
              </a>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}
