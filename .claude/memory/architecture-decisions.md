# Architecture Decisions

> ADR log — record decisions that affect structure, technology choice, or system boundaries.
> Append-only: never edit a past ADR; supersede with a new one.

---

## ADR-0000 — Template Use

- **Date:** 2026-04-26
- **Status:** Accepted
- **Context:** Project initialized from `~/.claude/templates/base/` v1.0.0.
- **Decision:** Adopt the template's universal agent roster (orchestrator, quality-auditor, pr-agent) and 4-path workflow (Feature, Bug, Refactor, Chore).
- **Consequences:** Specialists must be activated explicitly via `slots/`; deviations from the standard gates require an ADR.

---

## ADR-0001 — XYFlow + ELKjs for Graph Rendering and Layout

- **Date:** 2026-04-26
- **Status:** Accepted
- **Context:** AgentLens needs an interactive, auto-layouted graph canvas. Options: D3 (low-level, high effort), Cytoscape (mature but heavy), XYFlow + ELKjs (React-native, composable, ELK gives hierarchical/layered layout for directed agent graphs).
- **Decision:** Use XYFlow 12 as the React graph renderer and ELKjs 0.9.3 for async layout computation. Custom node type key is `'agent'`. All positions start at `{x: 0, y: 0}` and are replaced by ELK output.
- **Consequences:** ELK layout is async — must use `useEffect` not `useMemo`. XYFlow's built-in edge label renderer reads `edge.label` (top-level), not `edge.data.label`. Both must be set.

---

## ADR-0002 — nuqs for URL-Based State

- **Date:** 2026-04-26
- **Status:** Accepted
- **Context:** Users need to share specific agent graphs via URL (e.g., paste a URL to show a colleague the same workflow). YAML content is the primary state; it must survive page reload and be copy-pasteable.
- **Decision:** Use `nuqs` to sync the YAML editor content to the URL query string. This avoids a backend entirely and keeps the app local-first.
- **Consequences:** Large YAML payloads will produce long URLs. MVP accepts this trade-off. If URL length becomes a problem, switch to `localStorage` fallback or a share-code API (out of MVP scope).

---

## ADR-0003 — js-yaml + Zod for YAML Parsing and Validation

- **Date:** 2026-04-26
- **Status:** Accepted
- **Context:** YAML parsing needs two layers: (1) syntax parsing (any valid YAML → JS object), (2) schema validation (agent IDs exist, routes reference valid agents, required fields present). These concerns should be separated.
- **Decision:** `js-yaml` handles syntax parsing; Zod `WorkflowSchema` is the single source of truth for the YAML contract. Cross-reference validation (route source/target must reference existing agent IDs) lives in a `.refine()` on `WorkflowSchema`. The `useYamlParser` hook wraps both with 150ms debounce via `useState+useEffect+clearTimeout`.
- **Consequences:** If the YAML shape changes, update Zod first. The 150ms debounce prevents ELK layout from triggering on every keystroke.
