import type { Metadata } from 'next';
import { GUIDES } from '@/lib/guides';
import { buildPageMetadata, buildOgImageUrl, SITE_URL } from '@/lib/seo';

const HOME_DESCRIPTION =
  'Free online tool to visualize AI agent workflows. Supports CrewAI, LangGraph, and custom YAML agent orchestration schemas.';

export const metadata: Metadata = {
  description: HOME_DESCRIPTION,
  ...buildPageMetadata({
    title: 'AgentLens — AI Agent Orchestration Visualizer',
    description: HOME_DESCRIPTION,
    path: '/',
    ogImageUrl: buildOgImageUrl({ type: 'default' }),
    ogImageAlt: 'AgentLens — AI Agent Orchestration Visualizer',
  }),
};

const websiteSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'AgentLens',
  url: SITE_URL,
  description: HOME_DESCRIPTION,
};

export default function Home() {
  return (
    <>
      {/* static server-side object — safe for dangerouslySetInnerHTML */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
      />
      {/* Sticky navigation header */}
      <header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6">
          <span className="text-lg font-bold tracking-tight">AgentLens</span>
          <a
            href="/app"
            className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
          >
            Open Editor →
          </a>
        </div>
      </header>

      <main>
        {/* Hero section */}
        <section className="mx-auto max-w-6xl px-4 py-20 text-center sm:px-6 sm:py-28">
          <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
            Visualize Your AI Agent Orchestration in Seconds
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground">
            Paste your YAML agent workflow and watch a real-time interactive
            graph render instantly — no setup, no login, no data sent to any
            server.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <a
              href="/app"
              className="rounded-md bg-primary px-6 py-3 text-base font-semibold text-primary-foreground transition-opacity hover:opacity-90"
            >
              Try AgentLens Free →
            </a>
            <a
              href="/guides"
              className="rounded-md border border-border px-6 py-3 text-base font-semibold text-foreground transition-colors hover:bg-muted"
            >
              See Integration Guides
            </a>
          </div>
        </section>

        {/* Demo preview section */}
        <section className="mx-auto max-w-6xl px-4 pb-20 sm:px-6">
          {/* public/og/ directory does not exist — render a styled mockup */}
          <div className="overflow-hidden rounded-xl border border-border bg-card shadow-lg">
            <div className="grid grid-cols-1 divide-y divide-border md:grid-cols-2 md:divide-x md:divide-y-0">
              {/* Left panel: YAML editor mockup */}
              <div className="bg-muted/40 p-6">
                <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                  YAML Input
                </p>
                <pre className="overflow-x-auto rounded-md bg-background p-4 text-sm text-foreground">
                  <code>{`agents:
  - id: researcher
    name: Research Agent
    model: gpt-4o
    tools: [web_search]
  - id: writer
    name: Writing Agent
    model: gpt-4o
    tools: [markdown_writer]
routes:
  - id: r1
    source: researcher
    target: writer
    label: "Hand off findings"`}</code>
                </pre>
              </div>

              {/* Right panel: graph mockup */}
              <div className="flex flex-col items-center justify-center gap-4 p-6">
                <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                  Agent Graph
                </p>
                <svg
                  viewBox="0 0 300 180"
                  className="w-full max-w-xs"
                  aria-label="Diagram showing Research Agent connected by an arrow to Writing Agent"
                  role="img"
                >
                  {/* Research Agent node */}
                  <rect
                    x="10"
                    y="65"
                    width="120"
                    height="50"
                    rx="8"
                    className="fill-primary stroke-border"
                    strokeWidth="1.5"
                  />
                  <text
                    x="70"
                    y="86"
                    textAnchor="middle"
                    className="fill-primary-foreground"
                    fontSize="11"
                    fontWeight="600"
                  >
                    Research
                  </text>
                  <text
                    x="70"
                    y="102"
                    textAnchor="middle"
                    className="fill-primary-foreground"
                    fontSize="10"
                  >
                    Agent
                  </text>

                  {/* Arrow */}
                  <line
                    x1="130"
                    y1="90"
                    x2="168"
                    y2="90"
                    className="stroke-muted-foreground"
                    strokeWidth="2"
                    markerEnd="url(#arrow)"
                  />
                  <defs>
                    <marker
                      id="arrow"
                      markerWidth="8"
                      markerHeight="8"
                      refX="6"
                      refY="3"
                      orient="auto"
                    >
                      <path d="M0,0 L0,6 L8,3 z" className="fill-muted-foreground" />
                    </marker>
                  </defs>

                  {/* Writing Agent node */}
                  <rect
                    x="170"
                    y="65"
                    width="120"
                    height="50"
                    rx="8"
                    className="fill-secondary stroke-border"
                    strokeWidth="1.5"
                  />
                  <text
                    x="230"
                    y="86"
                    textAnchor="middle"
                    className="fill-secondary-foreground"
                    fontSize="11"
                    fontWeight="600"
                  >
                    Writing
                  </text>
                  <text
                    x="230"
                    y="102"
                    textAnchor="middle"
                    className="fill-secondary-foreground"
                    fontSize="10"
                  >
                    Agent
                  </text>
                </svg>
              </div>
            </div>
          </div>
          <p className="mt-4 text-center text-sm text-muted-foreground">
            Write YAML on the left, see your agent graph update in real time on
            the right.
          </p>
        </section>

        {/* Features section */}
        <section className="border-t border-border bg-muted/30 py-20">
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <h2 className="mb-12 text-center text-3xl font-bold tracking-tight text-foreground">
              Everything You Need to Understand Agent Workflows
            </h2>
            <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
              <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
                <div className="mb-4 text-3xl" aria-hidden="true">
                  ⚡
                </div>
                <h3 className="mb-2 text-lg font-semibold text-card-foreground">
                  Real-time Parsing
                </h3>
                <p className="text-sm text-muted-foreground">
                  Edit YAML and see the graph update with 150ms debounce. No
                  lag, no page reload.
                </p>
              </div>

              <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
                <div className="mb-4 text-3xl" aria-hidden="true">
                  🗺️
                </div>
                <h3 className="mb-2 text-lg font-semibold text-card-foreground">
                  Auto-Layout Engine
                </h3>
                <p className="text-sm text-muted-foreground">
                  Powered by ELKjs for clean, non-overlapping agent graphs. No
                  manual positioning needed.
                </p>
              </div>

              <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
                <div className="mb-4 text-3xl" aria-hidden="true">
                  🔗
                </div>
                <h3 className="mb-2 text-lg font-semibold text-card-foreground">
                  Instant URL Sharing
                </h3>
                <p className="text-sm text-muted-foreground">
                  Share any workflow with a single URL. No login required. Your
                  YAML is encoded directly in the link.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* What & Why — SEO article section */}
        <article className="mx-auto max-w-3xl px-4 py-20 sm:px-6">
          <h2 className="mb-6 text-3xl font-bold tracking-tight text-foreground">
            What is AgentLens?
          </h2>

          <div className="max-w-none space-y-5 text-muted-foreground">
            <p>
              AgentLens is a free, browser-based tool that transforms a YAML
              definition of an AI agent orchestration into an interactive, auto-laid-out
              graph — instantly, without sending a single byte to a server.
              Paste or type your workflow definition, and the canvas on the right
              updates in real time as you type.
            </p>

            <p>
              As teams build increasingly complex{' '}
              <strong className="text-foreground">agentic workflows</strong>,
              keeping mental models accurate becomes hard. An{' '}
              <strong className="text-foreground">AI agent diagram</strong>{' '}
              makes it possible to spot unreachable agents, misconfigured routes,
              and missing tool assignments at a glance — before running a single
              line of code. AgentLens turns the invisible architecture of your{' '}
              <strong className="text-foreground">multi-agent system</strong>{' '}
              into a visual map you can reason about, share with teammates, and
              use during onboarding.
            </p>

            <p>
              The YAML schema AgentLens understands is straightforward. At its
              core, a workflow file contains two top-level keys:{' '}
              <code className="rounded bg-muted px-1 py-0.5 text-sm text-foreground">
                agents
              </code>{' '}
              and{' '}
              <code className="rounded bg-muted px-1 py-0.5 text-sm text-foreground">
                routes
              </code>
              . Each agent entry accepts an{' '}
              <code className="rounded bg-muted px-1 py-0.5 text-sm text-foreground">
                id
              </code>
              ,{' '}
              <code className="rounded bg-muted px-1 py-0.5 text-sm text-foreground">
                name
              </code>
              ,{' '}
              <code className="rounded bg-muted px-1 py-0.5 text-sm text-foreground">
                model
              </code>
              , and a list of{' '}
              <code className="rounded bg-muted px-1 py-0.5 text-sm text-foreground">
                tools
              </code>
              . Routes declare a{' '}
              <code className="rounded bg-muted px-1 py-0.5 text-sm text-foreground">
                source
              </code>{' '}
              and a{' '}
              <code className="rounded bg-muted px-1 py-0.5 text-sm text-foreground">
                target
              </code>{' '}
              agent ID, forming the directed edges of the graph. Each route also requires an{' '}
              <code className="rounded bg-muted px-1 py-0.5 text-sm text-foreground">
                id
              </code>{' '}
              and a{' '}
              <code className="rounded bg-muted px-1 py-0.5 text-sm text-foreground">
                label
              </code>{' '}
              to uniquely identify and describe the handoff. Optional{' '}
              <code className="rounded bg-muted px-1 py-0.5 text-sm text-foreground">
                condition
              </code>{' '}
              fields let you annotate branching logic.
            </p>

            <p>
              AgentLens is built for developers working with{' '}
              <strong className="text-foreground">agent orchestration</strong>{' '}
              frameworks such as CrewAI, LangGraph, AutoGen, or any custom YAML
              schema. Whether you are designing a new{' '}
              <strong className="text-foreground">multi-agent pipeline</strong>,
              debugging an unexpected handoff sequence, or presenting your
              architecture to a non-technical stakeholder, an interactive graph
              is always clearer than a wall of YAML text.
            </p>

            <p>
              Because all computation — YAML parsing, Zod validation, ELK graph
              layout — runs entirely in your browser, there are no privacy
              concerns. Your agent definitions never leave your machine. The tool
              works offline once loaded, and any workflow can be shared as a
              plain URL by copying the address bar.
            </p>
          </div>
        </article>

        {/* Integration guides section */}
        <section className="border-t border-border bg-muted/30 py-20">
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <h2 className="mb-10 text-3xl font-bold tracking-tight text-foreground">
              Integration Guides
            </h2>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              {GUIDES.map((guide) => (
                <div
                  key={guide.slug}
                  className="rounded-xl border border-border bg-card p-6 shadow-sm"
                >
                  <p className="mb-1 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                    {guide.framework}
                  </p>
                  <h3 className="mb-3 text-lg font-bold text-card-foreground">
                    {guide.title}
                  </h3>
                  <p className="mb-4 text-sm text-muted-foreground">
                    {guide.description}
                  </p>
                  <a
                    href={`/guides/${guide.slug}`}
                    className="text-sm font-medium text-foreground underline underline-offset-4 hover:text-muted-foreground"
                  >
                    Read guide →
                  </a>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-border py-10">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="flex flex-col items-center justify-between gap-6 text-sm text-muted-foreground md:flex-row">
            {/* Left: brand + version */}
            <div className="flex items-center gap-2">
              <span className="font-bold text-foreground">AgentLens</span>
              <span className="rounded-full border border-border px-2 py-0.5 text-xs">
                v0.8.0
              </span>
            </div>

            {/* Center: privacy note */}
            <p className="max-w-sm text-center text-xs leading-relaxed">
              No YAML data is sent to our servers. All processing happens in
              your browser.
            </p>

            {/* Right: social placeholder */}
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
