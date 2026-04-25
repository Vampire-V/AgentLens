import { z } from 'zod';

const AgentSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  description: z.string().optional(),
  model: z.enum(['opus', 'sonnet', 'haiku']).optional(),
  tools: z.array(z.string()).optional().default([]),
});

const RouteSchema = z.object({
  id: z.string().min(1),
  source: z.string().min(1),
  target: z.string().min(1),
  label: z.string().min(1),
  condition: z.string().optional(),
});

export const WorkflowSchema = z
  .object({
    version: z.string().optional().default('1.0.0'),
    name: z.string().optional(),
    agents: z.array(AgentSchema).min(1),
    routes: z.array(RouteSchema).optional().default([]),
  })
  .refine(
    (data) => {
      const ids = new Set(data.agents.map((a) => a.id));
      return data.routes.every((r) => ids.has(r.source) && ids.has(r.target));
    },
    { message: 'Route source/target must reference existing agent IDs', path: ['routes'] }
  );

export type Workflow = z.infer<typeof WorkflowSchema>;
export type Agent = z.infer<typeof AgentSchema>;
export type Route = z.infer<typeof RouteSchema>;
