import { describe, it, expect, vi } from 'vitest';
import { renderHook, act, waitFor } from '@testing-library/react';
import { useElkLayout } from '../use-elk-layout';
import type { FlowNode, FlowEdge } from '@/lib/yaml-to-flow';

vi.mock('elkjs/lib/elk.bundled.js', () => ({
  default: class MockELK {
    async layout(graph: { children: { id: string }[] }) {
      return {
        children: graph.children.map((c, i) => ({ id: c.id, x: (i + 1) * 200, y: (i + 1) * 100 })),
      };
    }
  },
}));

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

describe('useElkLayout', () => {
  it('empty_nodes__hook__returns_empty_array_and_not_layouting', () => {
    const { result } = renderHook(() => useElkLayout([], []));
    expect(result.current.nodes).toEqual([]);
    expect(result.current.isLayouting).toBe(false);
  });

  it('nodes_provided__hook__resolves_with_positioned_nodes', async () => {
    const nodes = [makeNode('a'), makeNode('b')];
    const edges = [makeEdge('e1', 'a', 'b')];
    const { result } = renderHook(() => useElkLayout(nodes, edges));

    await waitFor(() => {
      expect(result.current.isLayouting).toBe(false);
    });

    expect(result.current.nodes).toHaveLength(2);
    expect(result.current.nodes[0].position).not.toEqual({ x: 0, y: 0 });
  });

  it('topology_unchanged__hook__does_not_trigger_extra_layout', async () => {
    const nodes = [makeNode('a')];
    const layoutSpy = vi.spyOn(
      (await import('elkjs/lib/elk.bundled.js')).default.prototype,
      'layout'
    );

    const { rerender } = renderHook(() => useElkLayout(nodes, []));

    await waitFor(() => expect(layoutSpy).toHaveBeenCalledTimes(1));

    // rerender with same topology (new array ref but same ids)
    rerender();
    await act(async () => {});

    expect(layoutSpy).toHaveBeenCalledTimes(1);
  });
});
