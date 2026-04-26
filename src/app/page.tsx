import { SplitPane } from "@/components/split-pane";

export default function Home() {
  return (
    <main className="flex h-full flex-col">
      <header className="flex items-center border-b border-border bg-background px-4 py-2">
        <span className="text-sm font-semibold text-foreground">AgentLens</span>
        <span className="ml-2 text-xs text-muted-foreground">YAML → Graph</span>
      </header>
      <div className="flex-1 overflow-hidden">
        <SplitPane />
      </div>
    </main>
  );
}
