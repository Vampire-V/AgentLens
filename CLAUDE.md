---
template_version: 1.0.0
instantiated_at: 2026-04-26
project_name: AgentLens
stack:
  language: TypeScript 5.x (strict mode)
  framework: Next.js 16 (App Router + Turbopack)
  test_runner: Vitest + React Testing Library
git:
  provider: github
  default_branch: main
specialists:
  backend: disabled
  frontend: enabled
  data: disabled
commands:
  lint: npm run lint && npm run type-check
  test: npm run test
  coverage: npm run test:coverage
---

# Project: AgentLens

A high-performance, web-based YAML visualizer for AI Agent Orchestration. Edit YAML
on the left, see the agent graph render and auto-layout on the right in real time.

**Target:** 1-day MVP. Bias toward shipping a working split-pane editor + canvas over
abstraction quality.

## Stack

- **Framework:** Next.js 16 (App Router) with Turbopack.
- **Visual Engine:** XYFlow (the modern successor to React Flow).
- **Layout Engine:** ELKjs (Eclipse Layout Kernel) for non-overlapping graph orchestration.
- **Styling:** Tailwind CSS v4 + Shadcn UI components.
- **State Management:** `nuqs` for URL-based state (allows flow sharing via URL).
- **Schema Validation:** Zod + `js-yaml` for robust YAML parsing.
- **Testing:** Vitest + React Testing Library; Playwright optional for E2E later.

## Architecture

**Local-first, modular layered:**
- `app/` — Next.js routes (App Router). Server Components by default; `use client` only where state demands it (canvas, editor).
- `components/` — UI components. `flow-canvas.tsx`, `yaml-editor.tsx`, `agent-inspector.tsx` are the core ones.
- `hooks/` — `use-yaml-parser.ts`, `use-elk-layout.ts`, etc. Domain logic lives here.
- `lib/` — Pure utilities. `lib/elk-layout.ts` (layout calc), `lib/yaml-schema.ts` (Zod), `lib/agent-types.ts`.
- All parsing and layout calculation happens client-side. No server round-trips for the editor loop.

## Default Patterns (curated for AgentLens)

- TDD-first for `lib/` (pure logic) and `hooks/`. Components: write component, exercise it in browser, then add tests for non-trivial interactions.
- Conventional Commits: `feat(canvas): ...`, `fix(parser): ...`, etc.
- Test naming: `<scenario>__<action>__<outcome>` for unit tests.
- Coverage target: 70% for `lib/` and `hooks/`; UI coverage best-effort.
- `useMemo` / `useCallback` on every value passed to `<XYFlow>` to prevent re-render storms during typing.
- Server Components by default; opt into `'use client'` only with a one-line justification comment above the directive.

## Non-Negotiables

- Never run YAML parsing or ELK layout on the server — all editor-loop computation is client-side.
- Never bypass TypeScript strictness (`@ts-ignore`, `as any`) without an inline comment explaining why.
- Never push to `main` directly — always via PR (pr-agent enforces).
- Zod schema is the single source of truth for the YAML contract. If the YAML shape changes, update Zod first, then everything else.
- Don't add backend / API routes for the MVP — if a feature needs backend, it's out of scope.

## Workflow

See `AGENTS.md` for the 4-path workflow (Feature, Bug, Refactor, Chore) and approval gates.
Frontend specialist is active; backend and data are disabled.

## Memory & Context

- `.claude/memory/active-context.md` — current sprint state. Update at milestone boundaries.
- `.claude/memory/architecture-decisions.md` — ADR log. Append-only.

## Notes for the Auditor

`commands.lint` chains lint + type-check (one fail-fast pipeline). `commands.test` runs Vitest in run-once mode. `commands.coverage` runs Vitest with the coverage reporter.
