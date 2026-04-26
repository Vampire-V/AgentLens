# AgentLens

[![CI](https://github.com/Vampire-V/AgentLens/actions/workflows/ci.yml/badge.svg)](https://github.com/Vampire-V/AgentLens/actions/workflows/ci.yml)
[![Live Demo](https://img.shields.io/badge/demo-live-brightgreen)](https://agent-lens-murex.vercel.app)

Visual YAML editor for AI agent orchestration workflows. Edit YAML on the left, see the agent graph auto-layout and render on the right in real time.

## Features

- **Split-pane editor** — YAML on the left, interactive graph on the right
- **Real-time parsing** — 150ms debounce, Zod schema validation with inline error display
- **Auto-layout** — ELKjs `layered` algorithm positions agents automatically (no manual drag needed)
- **URL sharing** — workflow state lives in the URL query string; paste the URL to share
- **Model badges** — color-coded by model tier (opus / sonnet / haiku)
- **Dark mode** — follows system preference, toggle manually with the ☀/🌙 button
- **Templates** — load pre-built workflows from the toolbar dropdown
- **Export PNG** — download the graph as a high-resolution PNG

## YAML Format

```yaml
version: "1.0.0"
name: "My Workflow"
agents:
  - id: orchestrator
    name: "Orchestrator"
    model: opus          # opus | sonnet | haiku
    tools: [Read, Bash]  # optional
    description: "..."   # optional
routes:
  - id: r1
    source: orchestrator
    target: researcher
    label: "Research task"
    condition: "..."     # optional
```

## Tech Stack

| Layer | Library |
|---|---|
| Framework | Next.js 16 (App Router + Turbopack) |
| Graph renderer | XYFlow 12 |
| Layout engine | ELKjs 0.9.3 |
| Styling | Tailwind CSS v4 |
| URL state | nuqs |
| Schema validation | Zod + js-yaml |
| Testing | Vitest + React Testing Library |

## Getting Started

```bash
npm install
npm run dev
# open http://localhost:3000
```

## Scripts

```bash
npm run dev          # dev server (Turbopack)
npm run build        # production build
npm run type-check   # TypeScript
npm run lint         # ESLint + type-check
npm run test         # Vitest (run once)
npm run coverage     # Vitest with coverage
```
