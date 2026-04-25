import { SplitPane } from "@/components/split-pane";

export default function Home() {
  return (
    <main className="flex h-full flex-col">
      <header className="flex items-center border-b border-zinc-200 bg-white px-4 py-2">
        <span className="text-sm font-semibold text-zinc-800">AgentLens</span>
        <span className="ml-2 text-xs text-zinc-400">YAML → Graph</span>
      </header>
      <div className="flex-1 overflow-hidden">
        <SplitPane />
      </div>
    </main>
  );
}
