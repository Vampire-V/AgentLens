'use client'; // stateful shell — useQueryState + all hooks require client

import { useCallback, useMemo, useRef, useState } from 'react';
import { useTheme } from 'next-themes';
import { useQueryState } from 'nuqs';
import { useYamlParser } from '@/hooks/use-yaml-parser';
import { useElkLayout } from '@/hooks/use-elk-layout';
import { workflowToFlowGraph } from '@/lib/yaml-to-flow';
import { FlowCanvas } from './flow-canvas';
import { YamlEditor } from './yaml-editor';
import { AgentInspector } from './agent-inspector';
import { TemplatePicker } from './template-picker';
import { ExportPngButton } from './export-png-button';
import { DarkModeToggle } from './dark-mode-toggle';

const DEFAULT_YAML = `version: "1.0.0"
name: "AI Research Pipeline"
agents:
  - id: coordinator
    name: "Coordinator"
    role: manager
    model: claude-opus-4-7
    prompt: |
      Hub of the pipeline. Receive the user's question, dispatch parallel
      research tasks to specialists, receive the final report, then archive
      results to memory for future retrieval.

  - id: web_researcher
    name: "Web Researcher"
    role: worker
    model: claude-sonnet-4-6
    tools: [web_search, browse_url, extract_content]
    prompt: "Search the web and extract relevant information on the assigned topic."

  - id: data_analyst
    name: "Data Analyst"
    role: worker
    model: claude-sonnet-4-6
    tools: [python_repl, csv_reader, chart_generator]
    prompt: "Analyze datasets, run calculations, and produce data-backed insights."

  - id: fact_checker
    name: "Fact Checker"
    role: critic
    model: claude-sonnet-4-6
    tools: [web_search]
    prompt: "Cross-check all claims from researchers. Flag anything unverified before writing."

  - id: writer
    name: "Report Writer"
    role: worker
    model: claude-sonnet-4-6
    prompt: "Synthesize verified findings into a clear, structured report for the user."

  - id: memory
    name: "Memory Store"
    role: tool
    model: claude-haiku-4-5
    tools: [vector_search, upsert_memory]
    prompt: "Persist completed research so future queries can retrieve prior context."

routes:
  - id: r1
    source: coordinator
    target: web_researcher
    label: "search task"
  - id: r2
    source: coordinator
    target: data_analyst
    label: "analysis task"
  - id: r3
    source: web_researcher
    target: fact_checker
    label: "search results"
  - id: r4
    source: data_analyst
    target: fact_checker
    label: "data insights"
  - id: r5
    source: fact_checker
    target: writer
    label: "verified findings"
  - id: r6
    source: writer
    target: coordinator
    label: "final report"
    condition: "deliver to coordinator → present to user"
  - id: r7
    source: coordinator
    target: memory
    label: "archive results"
    condition: "after report delivered"
`;

export function SplitPane() {
  const { resolvedTheme } = useTheme();
  const [yaml, setYaml] = useQueryState('yaml', { defaultValue: DEFAULT_YAML });
  const { workflow, error } = useYamlParser(yaml);

  const { nodes: rawNodes, edges } = useMemo(
    () => (workflow ? workflowToFlowGraph(workflow) : { nodes: [], edges: [] }),
    [workflow]
  );

  const { nodes, isLayouting } = useElkLayout(rawNodes, edges);

  const canvasRef = useRef<HTMLDivElement>(null);

  const handleYamlChange = useCallback((v: string) => void setYaml(v), [setYaml]);

  const [selectedAgentId, setSelectedAgentId] = useState<string | null>(null);

  const handleNodeClick = useCallback((nodeId: string) => {
    setSelectedAgentId(nodeId);
  }, []);

  const handleInspectorClose = useCallback(() => setSelectedAgentId(null), []);

  const selectedAgent = useMemo(
    () => workflow?.agents.find(a => a.id === selectedAgentId) ?? null,
    [workflow, selectedAgentId]
  );

  return (
    <div className="flex h-full w-full flex-col overflow-hidden">
      <div className="flex shrink-0 items-center gap-2 border-b border-border bg-background px-3 py-1.5">
        <TemplatePicker onSelect={handleYamlChange} />
        <div className="ml-auto flex items-center gap-1">
          <DarkModeToggle />
          <ExportPngButton containerRef={canvasRef} />
        </div>
      </div>
      <div className="flex flex-1 overflow-hidden">
        <div className="h-full w-1/2 border-r border-border">
          <YamlEditor value={yaml} onChange={handleYamlChange} error={error} />
        </div>
        <div ref={canvasRef} className="h-full w-1/2">
          <FlowCanvas nodes={nodes} edges={edges} isLayouting={isLayouting} onNodeClick={handleNodeClick} colorMode={resolvedTheme as 'light' | 'dark'} />
        </div>
      </div>
      <AgentInspector agent={selectedAgent} onClose={handleInspectorClose} />
    </div>
  );
}
