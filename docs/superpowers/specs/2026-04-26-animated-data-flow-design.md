# Animated Data Flow — Design Spec

**Date:** 2026-04-26  
**Status:** Approved  
**Feature:** Glowing dot particles animate along every edge in the graph, with role-based colors and hover-reveal labels.

---

## Overview

All edges in the AgentLens canvas will animate continuously — three glowing dot particles travel along each edge's Bezier curve using SVG `animateMotion`. The dot color reflects the source agent's role, creating a visual language consistent with existing node border colors. Edge labels (from YAML `label` field) appear as a tooltip on hover.

---

## Design Decisions

| Question | Choice | Reason |
|---|---|---|
| Style | Glowing Dots | Most visually compelling; looks like data packets |
| Timing | Always-on | No toggle needed; animation is the point |
| Labels | Hover tooltip | Keeps edge clean; label still accessible |
| Dot color | Role-based (source agent) | Consistent with existing node border color system |
| Implementation | SVG `animateMotion` + `mpath` | Dots follow Bezier curve exactly; pure SVG, no positioning math |

---

## Architecture

### New File

**`src/components/animated-edge.tsx`** — XYFlow custom edge component

Renders:
1. SVG `<path>` (the edge line, via `getBezierPath`) — dim gray (`#334155`), `strokeWidth=1.5`
2. Three `<circle>` elements, each with `<animateMotion><mpath href="#edge-path-{id}"/></animateMotion>`, staggered by `0s`, `0.5s`, `1.0s`; `dur="1.5s"`, `repeatCount="indefinite"`
3. SVG `<filter>` with `feGaussianBlur` (`stdDeviation=2`) for glow effect per edge
4. `<EdgeLabelRenderer>` div at `(labelX, labelY)` with `opacity-0 group-hover:opacity-100 transition-opacity` — only rendered when `data.label` is non-empty

### Modified File

**`src/components/flow-canvas.tsx`**

- Add `edgeTypes` memo: `{ animated: AnimatedEdge }`
- Build `agentMap: Record<string, Agent>` from the `nodes` prop before mapping routes
- When building XYFlow edges from routes, set:
  ```ts
  type: 'animated',
  data: { label: route.label, sourceRole: agentMap[route.source]?.role }
  ```
- Pass `edgeTypes` to `<ReactFlow>`

No other files change. YAML schema already has `label` on routes and `role` on agents.

---

## Role → Dot Color Map

```ts
const ROLE_DOT_COLORS: Record<string, string> = {
  manager: '#a78bfa',  // purple — matches border-purple-400
  worker:  '#60a5fa',  // blue   — matches border-blue-400
  critic:  '#fb923c',  // orange — matches border-orange-400
  tool:    '#4ade80',  // green  — matches border-green-400
  custom:  '#94a3b8',  // zinc
}
```

Fallback for unknown/missing role: `#94a3b8` (zinc-400).

---

## Component API

```tsx
// Props come from XYFlow EdgeProps<{ label?: string; sourceRole?: string }>
export function AnimatedEdge({
  id, sourceX, sourceY, targetX, targetY,
  sourcePosition, targetPosition,
  data, markerEnd,
}: EdgeProps<{ label?: string; sourceRole?: string }>)
```

No additional props. All data arrives through `data` (injected in `flow-canvas.tsx`).

---

## Testing

### Unit Tests — `src/components/__tests__/animated-edge.test.tsx` (Vitest)

| Test name | Assertion |
|---|---|
| `no_data__render__path_and_three_animate_motion` | DOM contains `<path>` and 3 `<animateMotion>` elements |
| `manager_source__render__purple_dot` | All circles have `fill="#a78bfa"` |
| `worker_source__render__blue_dot` | All circles have `fill="#60a5fa"` |
| `no_label__render__no_label_renderer` | `EdgeLabelRenderer` content not in DOM |
| `with_label__render__tooltip_element` | Tooltip span present in DOM |

### E2E Tests — `e2e/animated-edge.spec.ts` (Playwright, Chromium)

| Test | Action | Assertion |
|---|---|---|
| edges animate on load | Load default YAML | `animateMotion` elements present in SVG |
| manager edge is purple | Check default YAML (Coordinator is manager) | Edge circle `fill` = `#a78bfa` |
| hover reveals label | Hover edge midpoint area | Tooltip element becomes visible |

---

## Files to Create / Modify

| File | Action |
|---|---|
| `src/components/animated-edge.tsx` | **Create** |
| `src/components/__tests__/animated-edge.test.tsx` | **Create** |
| `e2e/animated-edge.spec.ts` | **Create** |
| `src/components/flow-canvas.tsx` | **Modify** — add `edgeTypes`, inject `sourceRole` |

---

## Out of Scope

- Animation speed control (always `1.5s`)
- Pause/stop toggle
- Edge thickness change on animation
- Backend / API changes
