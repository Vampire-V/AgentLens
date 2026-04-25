'use client'; // XYFlow requires client-side rendering

import { memo, useEffect } from 'react';
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  useNodesState,
  useEdgesState,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { AgentNode } from './agent-node';
import type { FlowNode, FlowEdge } from '@/lib/yaml-to-flow';

// must be at module level — object identity must be stable across renders
const nodeTypes = { agent: AgentNode };

interface FlowCanvasProps {
  nodes: FlowNode[];
  edges: FlowEdge[];
  isLayouting: boolean;
}

function FlowCanvasComponent({ nodes: elkNodes, edges: elkEdges, isLayouting }: FlowCanvasProps) {
  const [nodes, setNodes, onNodesChange] = useNodesState<FlowNode>(elkNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState<FlowEdge>(elkEdges);

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
        nodeTypes={nodeTypes}
        fitView
        fitViewOptions={{ padding: 0.2 }}
      >
        <Background />
        <Controls />
        <MiniMap />
      </ReactFlow>
    </div>
  );
}

export const FlowCanvas = memo(FlowCanvasComponent);
