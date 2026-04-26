'use client'; // stateful shell — useQueryState + all hooks require client

import { useCallback, useMemo, useRef, useState } from 'react';
import { useQueryState } from 'nuqs';
import { useYamlParser } from '@/hooks/use-yaml-parser';
import { useElkLayout } from '@/hooks/use-elk-layout';
import { workflowToFlowGraph } from '@/lib/yaml-to-flow';
import { FlowCanvas } from './flow-canvas';
import { YamlEditor } from './yaml-editor';
import { AgentInspector } from './agent-inspector';
import { TemplatePicker } from './template-picker';
import { ExportPngButton } from './export-png-button';

const DEFAULT_YAML = `version: "1.0.0"
name: "AI Research Pipeline"
agents:
  - id: coordinator
    name: "Coordinator"
    role: manager
    model: claude-opus-4-7
    prompt: |
      Orchestrate the research pipeline. Break down the user's question,
      dispatch sub-tasks to specialists, then synthesize findings into a report.

  - id: web_researcher
    name: "Web Researcher"
    role: worker
    model: claude-sonnet-4-6
    tools: [web_search, browse_url, extract_content]
    prompt: "Search the web and extract relevant information on assigned topics."

  - id: data_analyst
    name: "Data Analyst"
    role: worker
    model: claude-sonnet-4-6
    tools: [python_repl, csv_reader, chart_generator]

  - id: fact_checker
    name: "Fact Checker"
    role: critic
    model: claude-sonnet-4-6
    tools: [web_search]
    prompt: "Verify claims and flag inaccuracies before the report is written."

  - id: writer
    name: "Report Writer"
    role: worker
    model: claude-sonnet-4-6
    prompt: "Synthesize verified findings into a clear, structured report."

  - id: memory
    name: "Memory Store"
    role: tool
    model: claude-haiku-4-5
    tools: [vector_search, upsert_memory]

routes:
  - id: r1
    source: coordinator
    target: web_researcher
    label: "research brief"
  - id: r2
    source: coordinator
    target: data_analyst
    label: "data task"
  - id: r3
    source: web_researcher
    target: fact_checker
    label: "raw findings"
  - id: r4
    source: data_analyst
    target: fact_checker
    label: "analysis"
  - id: r5
    source: fact_checker
    target: writer
    label: "verified data"
  - id: r6
    source: writer
    target: coordinator
    label: "draft report"
  - id: r7
    source: coordinator
    target: memory
    label: "store context"
`;

export function SplitPane() {
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
      <div className="flex shrink-0 items-center gap-2 border-b border-zinc-100 bg-zinc-50 px-3 py-1.5">
        <TemplatePicker onSelect={handleYamlChange} />
        <div className="ml-auto">
          <ExportPngButton containerRef={canvasRef} />
        </div>
      </div>
      <div className="flex flex-1 overflow-hidden">
        <div className="h-full w-1/2 border-r border-zinc-200">
          <YamlEditor value={yaml} onChange={handleYamlChange} error={error} />
        </div>
        <div ref={canvasRef} className="h-full w-1/2">
          <FlowCanvas nodes={nodes} edges={edges} isLayouting={isLayouting} onNodeClick={handleNodeClick} />
        </div>
      </div>
      <AgentInspector agent={selectedAgent} onClose={handleInspectorClose} />
    </div>
  );
}
