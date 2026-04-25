'use client'; // XYFlow node components must run client-side

import { memo } from 'react';
import { Handle, Position } from '@xyflow/react';
import type { NodeProps } from '@xyflow/react';
import type { FlowNode } from '@/lib/yaml-to-flow';

const MODEL_COLORS: Record<string, string> = {
  opus: 'bg-purple-100 text-purple-700',
  sonnet: 'bg-blue-100 text-blue-700',
  haiku: 'bg-green-100 text-green-700',
};

function AgentNodeComponent({ data }: NodeProps<FlowNode>) {
  const modelColor = data.model ? (MODEL_COLORS[data.model] ?? 'bg-zinc-100 text-zinc-600') : null;

  return (
    <>
      <Handle type="target" position={Position.Top} />
      <div className="min-w-[172px] rounded-lg border border-zinc-200 bg-white px-4 py-3 shadow-sm">
        <div className="flex items-center justify-between gap-2">
          <span className="text-sm font-semibold text-zinc-900">{data.name}</span>
          {modelColor && (
            <span className={`rounded px-1.5 py-0.5 text-xs font-medium ${modelColor}`}>
              {data.model}
            </span>
          )}
        </div>
        {data.description && (
          <p className="mt-1 line-clamp-2 text-xs text-zinc-500">{data.description}</p>
        )}
        {data.tools && data.tools.length > 0 && (
          <p className="mt-1 text-xs text-zinc-400">{data.tools.join(', ')}</p>
        )}
      </div>
      <Handle type="source" position={Position.Bottom} />
    </>
  );
}

export const AgentNode = memo(AgentNodeComponent);
