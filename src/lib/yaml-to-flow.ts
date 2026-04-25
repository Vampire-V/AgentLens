import type { Node, Edge } from '@xyflow/react';
import type { Workflow, AgentRole } from './yaml-schema';

export type AgentNodeData = {
  name: string;
  description?: string;
  model?: string;
  role?: AgentRole;
  prompt?: string;
  tools?: string[];
};

export type FlowNode = Node<AgentNodeData, 'agent'>;
export type FlowEdge = Edge<{ label: string; condition?: string }>;

export function workflowToFlowGraph(workflow: Workflow): { nodes: FlowNode[]; edges: FlowEdge[] } {
  const nodes: FlowNode[] = workflow.agents.map((agent) => ({
    id: agent.id,
    type: 'agent',
    position: { x: 0, y: 0 },
    data: {
      name: agent.name,
      description: agent.description,
      model: agent.model,
      role: agent.role,
      prompt: agent.prompt,
      tools: agent.tools,
    },
  }));

  const edges: FlowEdge[] = workflow.routes.map((route) => ({
    id: route.id,
    source: route.source,
    target: route.target,
    label: route.label,
    data: { label: route.label, condition: route.condition },
  }));

  return { nodes, edges };
}
