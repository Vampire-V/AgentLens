'use client'; // stateful shell — useQueryState + all hooks require client

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { track } from '@/lib/analytics';
import { useTheme } from 'next-themes';
import { useQueryState } from 'nuqs';
import { compressedYamlParser } from '@/lib/compressed-yaml-parser';
import { useYamlParser } from '@/hooks/use-yaml-parser';
import { useElkLayout } from '@/hooks/use-elk-layout';
import { workflowToFlowGraph } from '@/lib/yaml-to-flow';
import { FlowCanvas } from './flow-canvas';
import { YamlEditor } from './yaml-editor';
import { AgentInspector } from './agent-inspector';
import { TemplatePicker } from './template-picker';
import { ExportPngButton } from './export-png-button';
import { DarkModeToggle } from './dark-mode-toggle';
import { DEFAULT_YAML } from '@/lib/default-yaml';

export function SplitPane() {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  // eslint-disable-next-line react-hooks/set-state-in-effect -- canonical next-themes SSR hydration pattern
  useEffect(() => setMounted(true), []);
  const colorMode = mounted ? ((resolvedTheme as 'light' | 'dark') ?? 'light') : 'light';

  const [yaml, setYaml] = useQueryState('yaml', compressedYamlParser.withDefault(DEFAULT_YAML));
  const { workflow, error } = useYamlParser(yaml);

  const { nodes: rawNodes, edges } = useMemo(
    () => (workflow ? workflowToFlowGraph(workflow) : { nodes: [], edges: [] }),
    [workflow]
  );

  const { nodes, isLayouting } = useElkLayout(rawNodes, edges);

  const canvasRef = useRef<HTMLDivElement>(null);
  const hasTrackedFirstKeystroke = useRef(false);

  const handleYamlChange = useCallback(
    (v: string) => {
      if (!hasTrackedFirstKeystroke.current) {
        hasTrackedFirstKeystroke.current = true;
        track('editor_first_keystroke', {});
      }
      void setYaml(v);
    },
    [setYaml]
  );

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
          <FlowCanvas nodes={nodes} edges={edges} isLayouting={isLayouting} onNodeClick={handleNodeClick} colorMode={colorMode} />
        </div>
      </div>
      <AgentInspector agent={selectedAgent} onClose={handleInspectorClose} />
    </div>
  );
}
