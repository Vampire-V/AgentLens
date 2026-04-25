# Active Context

> Living doc — update at the start/end of every milestone or sprint boundary.
> Orchestrator reads this on every routing decision.

**Current Sprint:** v0.3.0 — Canvas MVP ✅ SHIPPED
**Active Branch:** main (no remote yet — no PR pending)

## In Progress
- (none)

## Blockers
- (none)

## Recently Completed (v0.1.0 → v0.3.0)
- **v0.1.0** — Project scaffold: Next.js 16 + XYFlow + ELKjs + Tailwind v4 + Vitest baseline; agent framework
- **v0.1.1** — Parser layer: WorkflowSchema (Zod + cross-ref validation), workflowToFlowGraph, useYamlParser (debounced 150ms); CHANGELOG + audit gate
- **v0.2.0** — ELK layout: `elkLayout` pure async fn + `useElkLayout` topology-aware hook (24 tests pass)
- **v0.3.0** — Split-pane Canvas MVP:
  - `AgentNode` custom XYFlow node card (model color badges)
  - `FlowCanvas` with `memo()`, `useNodesState`, `FitViewOnChange` (refit on topology change)
  - `YamlEditor` controlled textarea + Zod error banner
  - `SplitPane` wiring useQueryState → useYamlParser → useElkLayout → FlowCanvas
  - URL-based YAML sharing via nuqs + NuqsAdapter in layout.tsx

## Notes for Next Session
- `nodeTypes = { agent: AgentNode }` must stay at **module level** in `flow-canvas.tsx` — never inline
- `FitViewOnChange` uses `setTimeout(150ms)` — must be child of `<ReactFlow>` to access `useReactFlow()`
- `NODE_HEIGHT=100` in elk-layout.ts must match actual rendered card height; update if card design changes
- No GitHub remote configured — push to remote before PR workflow
- Remaining quality suggestions (not blocking MVP): auto-refit with `useStore`, `data.label` dedup in yaml-to-flow.ts
