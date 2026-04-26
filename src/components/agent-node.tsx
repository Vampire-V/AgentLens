'use client'; // XYFlow node components must run client-side

import { memo } from 'react';
import { Handle, Position } from '@xyflow/react';
import type { NodeProps } from '@xyflow/react';
import type { FlowNode } from '@/lib/yaml-to-flow';
import type { AgentRole } from '@/lib/yaml-schema';

function getModelColorClass(model: string): string {
  if (model.includes('opus')) return 'bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-200';
  if (model.includes('sonnet')) return 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-200';
  if (model.includes('haiku')) return 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-200';
  return 'bg-zinc-100 text-zinc-600 dark:bg-zinc-700 dark:text-zinc-300';
}

const ROLE_BORDER_COLORS: Record<AgentRole, string> = {
  manager: 'border-purple-400 dark:border-purple-500',
  worker: 'border-blue-400 dark:border-blue-500',
  critic: 'border-orange-400 dark:border-orange-500',
  tool: 'border-green-400 dark:border-green-500',
  custom: 'border-zinc-200 dark:border-zinc-600',
};

function AgentNodeComponent({ data, selected }: NodeProps<FlowNode>) {
  const modelColor = data.model ? getModelColorClass(data.model) : null;
  const borderColor = ROLE_BORDER_COLORS[data.role ?? 'custom'];
  const selectedRing = selected ? 'ring-2 ring-blue-500 dark:ring-blue-400 ring-offset-1' : '';

  return (
    <>
      <Handle type="target" position={Position.Top} />
      <div className={`min-w-[172px] rounded-lg border bg-card px-4 py-3 shadow-sm dark:bg-zinc-800 ${borderColor} ${selectedRing}`}>
        <div className="flex items-center justify-between gap-2">
          <span className="text-sm font-semibold text-card-foreground">{data.name}</span>
          {modelColor && (
            <span className={`rounded px-1.5 py-0.5 text-xs font-medium ${modelColor}`}>
              {data.model}
            </span>
          )}
        </div>
        {data.description && (
          <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">{data.description}</p>
        )}
        {data.tools && data.tools.length > 0 && (
          <p className="mt-1 text-xs text-muted-foreground">{data.tools.join(', ')}</p>
        )}
      </div>
      <Handle type="source" position={Position.Bottom} />
    </>
  );
}

export const AgentNode = memo(AgentNodeComponent);
