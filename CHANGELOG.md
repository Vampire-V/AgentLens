# Changelog

All notable changes to AgentLens are documented here.
Format follows [Keep a Changelog](https://keepachangelog.com/en/1.0.0/).

---

## [Unreleased]

---

## v0.3.0 (2026-04-26)

### Added
- **ui:** `AgentNode` — XYFlow custom node card with model color badges (opus/sonnet/haiku)
- **ui:** `FlowCanvas` — XYFlow canvas with `Background`, `Controls`, `MiniMap`; `nodeTypes` at
  module level; syncs ELK-positioned nodes via `useNodesState` + `useEffect`; `FitViewOnChange`
  inner component refits viewport whenever ELK topology changes
- **ui:** `YamlEditor` — controlled textarea with inline Zod error banner
- **ui:** `SplitPane` — client shell wiring `useQueryState` (nuqs) → `useYamlParser` →
  `workflowToFlowGraph` → `useElkLayout` → `FlowCanvas`; YAML state shared via URL
- **infra:** `NuqsAdapter` added to `app/layout.tsx` (required for Next.js App Router)
- **infra:** `app/page.tsx` replaced with AgentLens split-pane layout

### Changed
- **ui:** `FlowCanvas` wrapped with `memo()` to prevent re-render storms on every keystroke
- **ui:** `onChange` in `SplitPane` wrapped with `useCallback` for stable identity
- **layout:** `NODE_HEIGHT` increased 60 → 100 to avoid node overlap when description is present

---

## v0.2.0 (2026-04-26)

### Added
- **layout:** `elkLayout` pure async function — wraps ELKjs `layered` algorithm,
  returns `FlowNode[]` with `{x,y}` positions replacing `{0,0}` placeholders
- **layout:** `useElkLayout` hook — topology-aware (re-layouts only when node IDs
  or edge connections change, not on every re-render); exposes `{ nodes, isLayouting }`

---

## v0.1.1 (2026-04-26)

### Fixed
- **parser:** `useYamlParser` now debounces 150ms via `useState+useEffect+clearTimeout`
  instead of `useMemo` — prevents ELK layout triggering on every keystroke
- **parser:** `workflowToFlowGraph` edges now include top-level `label` field
  (XYFlow built-in renderer reads `edge.label`, not `edge.data.label`)
- **agents:** `quality-auditor` changelog audit command changed from
  `git diff HEAD -- CHANGELOG.md` to `git diff ${DEFAULT_BRANCH}..HEAD -- CHANGELOG.md`
  (former was always empty after commit)
- **memory:** Updated `active-context.md` to reflect v0.2.0 canvas MVP sprint
- **memory:** Added ADR-0001 (XYFlow+ELK), ADR-0002 (nuqs), ADR-0003 (js-yaml+Zod)
  to `architecture-decisions.md`

---

## v0.1.0 (2026-04-26)

### Added
- **parser:** Zod-based YAML schema (`WorkflowSchema`) with cross-reference validation —
  route `source`/`target` must reference existing agent IDs
- **parser:** Pure flow converter (`workflowToFlowGraph`) — `Workflow → { nodes, edges }`
  with positions at `{0,0}` ready for ELK layout
- **parser:** `useYamlParser` hook — `useMemo`-based, wraps js-yaml + Zod,
  returns `{ workflow, error }`
- **infra:** Project scaffolded on Next.js 16 (App Router + Turbopack),
  XYFlow 12, ELKjs 0.9.3, Tailwind v4, Vitest 2, Zod, nuqs
- **infra:** Claude Code agent framework (orchestrator, quality-auditor, pr-agent,
  frontend-engineer-agent)

### YAML Format
```yaml
version: "1.0.0"
name: "Workflow Name"
agents:
  - id: orchestrator        # unique kebab-case ID
    name: "Orchestrator"
    description: "optional"
    model: opus             # opus | sonnet | haiku
    tools: [Read, Bash]
routes:
  - id: r1
    source: orchestrator
    target: backend-engineer
    label: "Feature request"
    condition: "optional trigger condition"
```
