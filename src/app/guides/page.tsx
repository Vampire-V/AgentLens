import type { Metadata } from 'next';
import { GUIDES } from '@/lib/guides';

export const metadata: Metadata = {
  title: 'Integration Guides',
  description:
    'Step-by-step guides to visualize your AI agent framework workflows in AgentLens.',
};

export default function GuidesIndexPage() {
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

      <main className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <div className="mb-12">
          <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
            Integration Guides
          </h1>
          <p className="mt-4 max-w-2xl text-lg text-muted-foreground">
            Step-by-step guides to visualize your AI agent framework workflows
            in AgentLens.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {GUIDES.map((guide) => (
            <div
              key={guide.slug}
              className="rounded-xl border border-border bg-card p-6 shadow-sm"
            >
              <p className="mb-1 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                {guide.framework}
              </p>
              <h2 className="mb-3 text-lg font-bold text-card-foreground">
                {guide.title}
              </h2>
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
