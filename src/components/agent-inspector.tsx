// Sheet component is interactive (open/close state lives in the client)
'use client';

import type { Agent, AgentRole } from '@/lib/yaml-schema';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';

interface AgentInspectorProps {
  agent: Agent | null | undefined;
  onClose: () => void;
}

const ROLE_BADGE_COLORS: Record<AgentRole, string> = {
  manager: 'bg-purple-100 text-purple-700',
  worker: 'bg-blue-100 text-blue-700',
  critic: 'bg-orange-100 text-orange-700',
  tool: 'bg-green-100 text-green-700',
  custom: 'bg-zinc-100 text-zinc-600',
};

export function AgentInspector({ agent, onClose }: AgentInspectorProps) {
  const open = agent != null;

  const roleColor = agent ? ROLE_BADGE_COLORS[agent.role] : ROLE_BADGE_COLORS.custom;

  return (
    <Sheet
      open={open}
      onOpenChange={(isOpen) => {
        if (!isOpen) onClose();
      }}
    >
      <SheetContent side="right">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <span>{agent?.name}</span>
            {agent && (
              <span className={`rounded px-2 py-0.5 text-xs font-medium ${roleColor}`}>
                {agent.role}
              </span>
            )}
          </SheetTitle>
        </SheetHeader>

        {agent && (
          <div className="flex flex-col gap-4 px-4 pb-4">
            {agent.model && (
              <div>
                <p className="mb-1 text-xs font-medium uppercase tracking-wide text-zinc-500">
                  Model
                </p>
                <p className="text-sm text-zinc-900">{agent.model}</p>
              </div>
            )}

            {agent.prompt && (
              <div>
                <p className="mb-1 text-xs font-medium uppercase tracking-wide text-zinc-500">
                  Prompt
                </p>
                <pre className="max-h-64 overflow-auto whitespace-pre-wrap rounded-md bg-zinc-50 p-3 text-sm text-zinc-800">
                  {agent.prompt}
                </pre>
              </div>
            )}

            {agent.tools && agent.tools.length > 0 && (
              <div>
                <p className="mb-1 text-xs font-medium uppercase tracking-wide text-zinc-500">
                  Tools
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {agent.tools.map((tool) => (
                    <span
                      key={tool}
                      className="rounded bg-zinc-100 px-2 py-0.5 text-xs text-zinc-700"
                    >
                      {tool}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
