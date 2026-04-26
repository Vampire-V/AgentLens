import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'How to Visualize LangGraph Agent Graphs',
  description:
    'Step-by-step guide to create LangGraph diagrams using AgentLens. Visualize your LangGraph state machine as an interactive agent flow graph.',
};

const LANGGRAPH_YAML = `version: "1.0.0"
name: "LangGraph State Machine"
agents:
  - id: entry_node
    name: "Entry Node"
    model: sonnet
    description: "Initial state processing and routing"
  - id: researcher
    name: "Researcher Node"
    model: opus
    tools: [TavilySearch, WebLoader]
    description: "Performs research based on the query"
  - id: grader
    name: "Relevance Grader"
    model: haiku
    description: "Grades document relevance and decides next step"
  - id: generator
    name: "Answer Generator"
    model: opus
    tools: [LLMChain]
    description: "Generates the final answer from relevant docs"
routes:
  - id: r1
    source: entry_node
    target: researcher
    label: "Route to research"
  - id: r2
    source: researcher
    target: grader
    label: "Documents retrieved"
  - id: r3
    source: grader
    target: generator
    label: "Relevant docs"
    condition: "relevance_score > 0.7"
  - id: r4
    source: grader
    target: researcher
    label: "Re-search"
    condition: "relevance_score <= 0.7"`;

export default function VisualizeLangGraphPage() {
  return (
    <>
      <header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6">
          <a href="/" className="text-lg font-bold tracking-tight">
            AgentLens
          </a>
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
          LangGraph
        </p>

        <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
          How to Visualize LangGraph Agent Graphs
        </h1>

        <p className="mt-6 text-lg text-muted-foreground">
          LangGraph is a state machine-based agent orchestration library from
          LangChain that lets you model complex agent behavior as a directed
          graph of nodes and conditional edges. When your state machine grows
          to include multiple routing conditions and feedback loops, reasoning
          about it from code alone becomes difficult. Using AgentLens as your{' '}
          <strong className="text-foreground">LangGraph diagram tool</strong>{' '}
          lets you convert your graph definition to YAML and explore the full
          topology interactively — including conditional edges, re-routing
          loops, and model assignments across nodes.
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
                Your LangGraph YAML config
              </strong>{' '}
              — or use the example below to try it out immediately
            </li>
          </ul>
        </section>

        <section className="mt-12">
          <h2 className="text-2xl font-bold tracking-tight text-foreground">
            Step 1 — Write Your LangGraph YAML
          </h2>
          <p className="mt-4 text-muted-foreground">
            AgentLens uses a straightforward YAML schema. A workflow file has
            two top-level keys:{' '}
            <code className="rounded bg-muted px-1 py-0.5 text-sm text-foreground">agents</code> and{' '}
            <code className="rounded bg-muted px-1 py-0.5 text-sm text-foreground">routes</code>. In
            LangGraph terms, agents map to nodes and routes map to edges.
          </p>
          <p className="mt-3 text-muted-foreground">
            Each agent requires an{' '}
            <code className="rounded bg-muted px-1 py-0.5 text-sm text-foreground">id</code> (no
            spaces) and a{' '}
            <code className="rounded bg-muted px-1 py-0.5 text-sm text-foreground">name</code>.
            Optionally set a{' '}
            <code className="rounded bg-muted px-1 py-0.5 text-sm text-foreground">model</code>{' '}
            (common values:{' '}
            <code className="rounded bg-muted px-1 py-0.5 text-sm text-foreground">opus</code>,{' '}
            <code className="rounded bg-muted px-1 py-0.5 text-sm text-foreground">sonnet</code>,{' '}
            <code className="rounded bg-muted px-1 py-0.5 text-sm text-foreground">haiku</code>) and a
            list of{' '}
            <code className="rounded bg-muted px-1 py-0.5 text-sm text-foreground">tools</code>. Each
            route requires an{' '}
            <code className="rounded bg-muted px-1 py-0.5 text-sm text-foreground">id</code>,{' '}
            <code className="rounded bg-muted px-1 py-0.5 text-sm text-foreground">source</code>,{' '}
            <code className="rounded bg-muted px-1 py-0.5 text-sm text-foreground">target</code>, and a{' '}
            <code className="rounded bg-muted px-1 py-0.5 text-sm text-foreground">label</code>
            describing the transition. The optional{' '}
            <code className="rounded bg-muted px-1 py-0.5 text-sm text-foreground">condition</code>{' '}
            field maps directly to LangGraph&apos;s conditional edge logic.
          </p>
          <p className="mt-3 text-muted-foreground">
            Here is a complete example modelling a LangGraph RAG pipeline with
            a relevance-grading loop:
          </p>
          <pre className="mt-4 overflow-x-auto rounded-xl bg-zinc-900 p-5 text-sm text-zinc-100">
            <code>{LANGGRAPH_YAML}</code>
          </pre>
        </section>

        <section className="mt-12">
          <h2 className="text-2xl font-bold tracking-tight text-foreground">
            Step 2 — Paste into AgentLens
          </h2>
          <p className="mt-4 text-muted-foreground">
            Open AgentLens by clicking the button below. Paste your YAML into
            the left panel and the graph updates on the right within 150 ms.
            The ELK layout engine automatically positions nodes so that edges
            do not overlap, making even complex state machines easy to follow.
          </p>
        </section>

        <section className="mt-12">
          <h2 className="text-2xl font-bold tracking-tight text-foreground">
            Step 3 — Read the Graph
          </h2>
          <p className="mt-4 text-muted-foreground">
            Each box corresponds to a node (agent) in your LangGraph graph.
            Directed arrows represent routes, with the{' '}
            <code className="rounded bg-muted px-1 py-0.5 text-sm text-foreground">label</code> shown
            on each edge. Routes that include a{' '}
            <code className="rounded bg-muted px-1 py-0.5 text-sm text-foreground">condition</code>{' '}
            display the condition expression, making branching logic
            immediately visible. Node color indicates the assigned model —
            useful for spotting which nodes invoke the most capable models.
            Click any node to open the inspector and view the full
            configuration.
          </p>
        </section>

        <div className="mt-12">
          <a
            href="/app"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block rounded-lg bg-primary px-8 py-4 text-base font-semibold text-primary-foreground transition-opacity hover:opacity-90"
          >
            Try this LangGraph template →
          </a>
        </div>

        <section className="mt-16 border-t border-border pt-10">
          <h2 className="text-xl font-bold tracking-tight text-foreground">
            Related Guides
          </h2>
          <ul className="mt-4 space-y-2 text-muted-foreground">
            <li>
              <a
                href="/guides/visualize-crewai"
                className="font-medium text-foreground underline underline-offset-4 hover:text-muted-foreground"
              >
                How to Visualize Your CrewAI Workflow →
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
