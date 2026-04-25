'use client'; // stateful shell — useQueryState + all hooks require client

import { useCallback, useMemo } from 'react';
import { useQueryState } from 'nuqs';
import { useYamlParser } from '@/hooks/use-yaml-parser';
import { useElkLayout } from '@/hooks/use-elk-layout';
import { workflowToFlowGraph } from '@/lib/yaml-to-flow';
import { FlowCanvas } from './flow-canvas';
import { YamlEditor } from './yaml-editor';

const DEFAULT_YAML = `version: "1.0.0"
name: "My Workflow"
agents:
  - id: orchestrator
    name: "Orchestrator"
    model: opus
  - id: researcher
    name: "Researcher"
    model: sonnet
  - id: writer
    name: "Writer"
    model: haiku
routes:
  - id: r1
    source: orchestrator
    target: researcher
    label: "Research task"
  - id: r2
    source: researcher
    target: writer
    label: "Write content"
`;

export function SplitPane() {
  const [yaml, setYaml] = useQueryState('yaml', { defaultValue: DEFAULT_YAML });
  const { workflow, error } = useYamlParser(yaml);

  const { nodes: rawNodes, edges } = useMemo(
    () => (workflow ? workflowToFlowGraph(workflow) : { nodes: [], edges: [] }),
    [workflow]
  );

  const { nodes, isLayouting } = useElkLayout(rawNodes, edges);

  const handleYamlChange = useCallback((v: string) => void setYaml(v), [setYaml]);

  return (
    <div className="flex h-full w-full overflow-hidden">
      <div className="h-full w-1/2 border-r border-zinc-200">
        <YamlEditor value={yaml} onChange={handleYamlChange} error={error} />
      </div>
      <div className="h-full w-1/2">
        <FlowCanvas nodes={nodes} edges={edges} isLayouting={isLayouting} />
      </div>
    </div>
  );
}
