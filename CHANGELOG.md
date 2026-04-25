# Changelog

All notable changes to AgentLens are documented here.
Format follows [Keep a Changelog](https://keepachangelog.com/en/1.0.0/).

---

## [Unreleased]

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
