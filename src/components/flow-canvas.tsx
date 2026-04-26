'use client'; // XYFlow requires client-side rendering

import { memo, useCallback, useEffect } from 'react';
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  useNodesState,
  useEdgesState,
  useReactFlow,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { AgentNode } from './agent-node';
import type { FlowNode, FlowEdge } from '@/lib/yaml-to-flow';

// must be at module level — object identity must be stable across renders
const nodeTypes = { agent: AgentNode };

// rendered inside <ReactFlow> context so useReactFlow() is available
function FitViewOnChange({ elkNodes }: { elkNodes: FlowNode[] }) {
  const { fitView } = useReactFlow();
  useEffect(() => {
    if (elkNodes.length === 0) return;
    // 150ms gives React time to flush setNodes + XYFlow to measure node dimensions via ResizeObserver
    const id = setTimeout(() => fitView({ padding: 0.2 }), 150);
    return () => clearTimeout(id);
  }, [elkNodes, fitView]);
  return null;
}

interface FlowCanvasProps {
  nodes: FlowNode[];
  edges: FlowEdge[];
  isLayouting: boolean;
  onNodeClick?: (nodeId: string) => void;
}

function FlowCanvasComponent({ nodes: elkNodes, edges: elkEdges, isLayouting, onNodeClick }: FlowCanvasProps) {
  const [nodes, setNodes, onNodesChange] = useNodesState<FlowNode>(elkNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState<FlowEdge>(elkEdges);

  const handleNodeClick = useCallback(
    (_event: React.MouseEvent, node: FlowNode) => {
      onNodeClick?.(node.id);
    },
    [onNodeClick]
  );

  useEffect(() => {
    setNodes(elkNodes);
  }, [elkNodes, setNodes]);

  useEffect(() => {
    setEdges(elkEdges);
  }, [elkEdges, setEdges]);

  return (
    <div className="relative h-full w-full">
      {isLayouting && (
        <div className="absolute inset-0 z-10 flex items-center justify-center bg-white/60">
          <span className="text-sm text-zinc-500">Laying out…</span>
        </div>
      )}
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onNodeClick={handleNodeClick}
        nodeTypes={nodeTypes}
      >
        <Background />
        <Controls />
        <MiniMap />
        <FitViewOnChange elkNodes={elkNodes} />
      </ReactFlow>
    </div>
  );
}

export const FlowCanvas = memo(FlowCanvasComponent);
