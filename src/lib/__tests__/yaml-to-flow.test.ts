import { describe, it, expect } from 'vitest';
import { workflowToFlowGraph } from '../yaml-to-flow';
import type { Workflow } from '../yaml-schema';

const threeAgentWorkflow: Workflow = {
  version: '1.0.0',
  name: 'Test',
  agents: [
    { id: 'orchestrator', name: 'Orchestrator', tools: [] },
    { id: 'backend-engineer', name: 'Backend Engineer', tools: [] },
    { id: 'quality-auditor', name: 'Quality Auditor', description: 'Reviews code', tools: [] },
  ],
  routes: [
    { id: 'r1', source: 'orchestrator', target: 'backend-engineer', label: 'Feature request' },
    {
      id: 'r2',
      source: 'backend-engineer',
      target: 'quality-auditor',
      label: 'FAIL',
      condition: 'audit fails',
    },
  ],
};

describe('workflowToFlowGraph', () => {
  it('three_agents_two_routes__convert__returns_correct_node_and_edge_count', () => {
    const { nodes, edges } = workflowToFlowGraph(threeAgentWorkflow);
    expect(nodes).toHaveLength(3);
    expect(edges).toHaveLength(2);
  });

  it('route_data__convert__edge_has_label_and_condition', () => {
    const { edges } = workflowToFlowGraph(threeAgentWorkflow);
    const r2 = edges.find((e) => e.id === 'r2');
    expect(r2?.data?.label).toBe('FAIL');
    expect(r2?.data?.condition).toBe('audit fails');
  });

  it('agent_without_model__convert__node_data_model_is_undefined', () => {
    const { nodes } = workflowToFlowGraph(threeAgentWorkflow);
    const backendNode = nodes.find((n) => n.id === 'backend-engineer');
    expect(backendNode?.data.model).toBeUndefined();
  });

  it('all_nodes__convert__position_is_zero_zero', () => {
    const { nodes } = workflowToFlowGraph(threeAgentWorkflow);
    nodes.forEach((node) => {
      expect(node.position).toEqual({ x: 0, y: 0 });
    });
  });
});
