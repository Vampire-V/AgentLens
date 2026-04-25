# Active Context

> Living doc — update at the start/end of every milestone or sprint boundary.
> Orchestrator reads this on every routing decision.

**Current Sprint:** v0.2.0 — Canvas MVP
**Active Branch:** main

## In Progress
- ELK layout hook (`src/hooks/use-elk-layout.ts` + `src/lib/elk-layout.ts`)

## Blockers
- (none)

## Recently Completed
- v0.1.0 parser layer: WorkflowSchema (Zod, cross-ref validation), workflowToFlowGraph, useYamlParser (debounced 150ms)
- Project scaffold: Next.js 16 + XYFlow + ELKjs + Tailwind v4 + Vitest baseline
- Claude Code agent framework: orchestrator, quality-auditor, pr-agent, frontend-engineer-agent
- CHANGELOG.md + versioning workflow enforced in audit gate
- Skills: frontend-design, playwright, context7 MCP

## Notes for Next Session
- ELK layout is async — use `useEffect` not `useMemo`, worker or requestIdleCallback if needed
- XYFlow custom node type key = `'agent'` (defined in yaml-to-flow.ts)
- Edge labels already at top-level `edge.label` — XYFlow default renderer will show them
