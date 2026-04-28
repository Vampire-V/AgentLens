import { describe, it, expect, vi } from 'vitest';
import { renderHook, act, waitFor } from '@testing-library/react';
import { useElkLayout } from '../use-elk-layout';
import { track } from '@/lib/analytics';
import type { FlowNode, FlowEdge } from '@/lib/yaml-to-flow';

vi.mock('@/lib/analytics', () => ({ track: vi.fn() }));

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

  it('two_or_more_nodes__first_layout__fires_workflow_rendered_with_correct_properties', async () => {
    vi.mocked(track).mockClear();
    const nodes = [makeNode('a'), makeNode('b')];
    const edges = [makeEdge('e1', 'a', 'b')];
    const { result } = renderHook(() => useElkLayout(nodes, edges));

    await waitFor(() => expect(result.current.isLayouting).toBe(false));

    expect(vi.mocked(track)).toHaveBeenCalledOnce();
    expect(vi.mocked(track)).toHaveBeenCalledWith(
      'workflow_rendered',
      expect.objectContaining({ agent_count: 2, route_count: 1 })
    );
    expect((vi.mocked(track).mock.calls[0][1] as { render_time_ms: number }).render_time_ms).toBeGreaterThanOrEqual(0);
  });

  it('one_node__layout__does_not_fire_workflow_rendered', async () => {
    vi.mocked(track).mockClear();
    const { result } = renderHook(() => useElkLayout([makeNode('a')], []));

    await waitFor(() => expect(result.current.isLayouting).toBe(false));

    expect(vi.mocked(track)).not.toHaveBeenCalled();
  });

  it('topology_change_after_first_render__second_layout__does_not_fire_again', async () => {
    vi.mocked(track).mockClear();
    const { result, rerender } = renderHook(
      ({ n, e }: { n: FlowNode[]; e: FlowEdge[] }) => useElkLayout(n, e),
      { initialProps: { n: [makeNode('a'), makeNode('b')], e: [makeEdge('e1', 'a', 'b')] } }
    );

    await waitFor(() => expect(result.current.isLayouting).toBe(false));
    expect(vi.mocked(track)).toHaveBeenCalledOnce();

    // topology change — triggers a second ELK run on the same hook instance
    rerender({ n: [makeNode('a'), makeNode('b'), makeNode('c')], e: [] });
    await waitFor(() => expect(result.current.isLayouting).toBe(false));

    expect(vi.mocked(track)).toHaveBeenCalledOnce(); // still exactly 1
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
