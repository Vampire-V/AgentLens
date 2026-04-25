import { describe, it, expect } from 'vitest';
import { elkLayout } from '../elk-layout';
import type { FlowNode, FlowEdge } from '../yaml-to-flow';

const makeNode = (id: string): FlowNode => ({
  id,
  type: 'agent',
  position: { x: 0, y: 0 },
  data: { name: id },
});

const makeEdge = (id: string, source: string, target: string): FlowEdge => ({
  id,
  source,
  target,
  data: { label: id },
});

describe('elkLayout', () => {
  it('empty_nodes__layout__returns_empty_array', async () => {
    const result = await elkLayout([], []);
    expect(result).toEqual([]);
  });

  it('single_node__layout__returns_position_not_zero_zero', async () => {
    const nodes = [makeNode('a')];
    const result = await elkLayout(nodes, []);
    expect(result).toHaveLength(1);
    expect(result[0].position).not.toEqual({ x: 0, y: 0 });
  });

  it('three_nodes_two_edges__layout__all_nodes_have_unique_positions', async () => {
    const nodes = [makeNode('a'), makeNode('b'), makeNode('c')];
    const edges = [makeEdge('e1', 'a', 'b'), makeEdge('e2', 'b', 'c')];
    const result = await elkLayout(nodes, edges);
    expect(result).toHaveLength(3);
    const positions = result.map((n) => `${n.position.x},${n.position.y}`);
    const unique = new Set(positions);
    expect(unique.size).toBe(3);
  });

  it('layout__preserves_node_data', async () => {
    const node = makeNode('a');
    node.data.description = 'test agent';
    const result = await elkLayout([node], []);
    expect(result[0].data.description).toBe('test agent');
  });
});
