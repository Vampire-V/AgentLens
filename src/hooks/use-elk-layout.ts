'use client'; // useEffect + useState — must run client-side

import { useState, useEffect, useMemo } from 'react';
import { elkLayout } from '@/lib/elk-layout';
import type { FlowNode, FlowEdge } from '@/lib/yaml-to-flow';

export interface ElkLayoutResult {
  nodes: FlowNode[];
  isLayouting: boolean;
}

export function useElkLayout(nodes: FlowNode[], edges: FlowEdge[]): ElkLayoutResult {
  const [laidOutNodes, setLaidOutNodes] = useState<FlowNode[]>(nodes);
  const [isLayouting, setIsLayouting] = useState(false);

  // re-layout only when topology changes, not on every re-render with new array refs
  const nodesKey = useMemo(() => nodes.map((n) => n.id).join(','), [nodes]);
  const edgesKey = useMemo(
    () => edges.map((e) => `${e.source}->${e.target}`).join(','),
    [edges]
  );

  useEffect(() => {
    let cancelled = false;

    void (async () => {
      if (nodes.length === 0) {
        setLaidOutNodes([]);
        setIsLayouting(false);
        return;
      }

      setIsLayouting(true);

      try {
        const positioned = await elkLayout(nodes, edges);
        if (!cancelled) {
          setLaidOutNodes(positioned);
          setIsLayouting(false);
        }
      } catch {
        if (!cancelled) {
          setLaidOutNodes(nodes);
          setIsLayouting(false);
        }
      }
    })();

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [nodesKey, edgesKey]); // topology-only deps — intentional

  return { nodes: laidOutNodes, isLayouting };
}
