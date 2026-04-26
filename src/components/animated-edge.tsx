'use client'; // XYFlow requires client-side rendering

import { memo } from 'react';
import { getBezierPath, EdgeLabelRenderer } from '@xyflow/react';
import type { EdgeProps, Edge } from '@xyflow/react';
import type { AgentRole } from '@/lib/yaml-schema';

const ROLE_DOT_COLORS: Record<string, string> = {
  manager: '#a78bfa',
  worker:  '#60a5fa',
  critic:  '#fb923c',
  tool:    '#4ade80',
  custom:  '#94a3b8',
};

const DOT_DELAYS = [0, 0.5, 1.0];

export type AnimatedEdgeData = {
  label?: string;
  sourceRole?: AgentRole;
};

function AnimatedEdgeComponent({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  data,
  markerEnd,
}: EdgeProps<Edge<AnimatedEdgeData>>) {
  const [edgePath, labelX, labelY] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });

  const color = ROLE_DOT_COLORS[data?.sourceRole ?? ''] ?? '#94a3b8';
  const pathId = `edge-path-${id}`;
  const filterId = `glow-${id}`;

  return (
    <>
      <defs>
        <filter id={filterId}>
          <feGaussianBlur stdDeviation="2" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
      <g>
        <path
          id={pathId}
          d={edgePath}
          stroke="#334155"
          strokeWidth={1.5}
          fill="none"
          markerEnd={markerEnd}
        />
        {DOT_DELAYS.map((delay) => (
          <circle key={delay} r={4} fill={color} filter={`url(#${filterId})`}>
            <animateMotion dur="1.5s" begin={`${delay}s`} repeatCount="indefinite">
              <mpath href={`#${pathId}`} />
            </animateMotion>
          </circle>
        ))}
      </g>
      {data?.label && (
        <EdgeLabelRenderer>
          <div
            style={{
              transform: `translate(-50%, -50%) translate(${labelX}px, ${labelY}px)`,
              pointerEvents: 'all',
              position: 'absolute',
            }}
            className="nodrag nopan group"
          >
            <span className="opacity-0 group-hover:opacity-100 transition-opacity bg-zinc-800 text-zinc-200 text-xs px-2 py-0.5 rounded whitespace-nowrap">
              {data.label}
            </span>
          </div>
        </EdgeLabelRenderer>
      )}
    </>
  );
}

export const AnimatedEdge = memo(AnimatedEdgeComponent);
