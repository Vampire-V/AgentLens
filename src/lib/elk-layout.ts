import ELK from 'elkjs/lib/elk.bundled.js';
import type { FlowNode, FlowEdge } from './yaml-to-flow';

const NODE_WIDTH = 172;
const NODE_HEIGHT = 100;

const elk = new ELK();

export async function elkLayout(nodes: FlowNode[], edges: FlowEdge[]): Promise<FlowNode[]> {
  if (nodes.length === 0) return [];

  const graph = {
    id: 'root',
    layoutOptions: {
      'elk.algorithm': 'layered',
      'elk.direction': 'DOWN',
      'elk.spacing.nodeNode': '80',
      'elk.layered.spacing.nodeNodeBetweenLayers': '100',
    },
    children: nodes.map((n) => ({ id: n.id, width: NODE_WIDTH, height: NODE_HEIGHT })),
    edges: edges.map((e) => ({ id: e.id, sources: [e.source], targets: [e.target] })),
  };

  const result = await elk.layout(graph);

  return nodes.map((n) => {
    const laid = result.children?.find((c) => c.id === n.id);
    if (laid?.x == null || laid?.y == null) return n;
    return { ...n, position: { x: laid.x, y: laid.y } };
  });
}
