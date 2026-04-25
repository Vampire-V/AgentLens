# AGENTS.md — Workflow & Routing

> The orchestrator-agent uses this file to decide routing. Edit per project as needed,
> but keep the universal sections intact so other projects using the same template
> behave consistently.

---

## Roster

### Universal (shipped with template)
- **orchestrator-agent** — routes work to specialists; reads `CLAUDE.md` + `.claude/memory/active-context.md`
- **quality-auditor-agent** — pre-merge gate; reads `commands.*` from CLAUDE.md frontmatter
- **pr-agent** — provider-aware PR creator (github/gitlab/bitbucket/local)

### Specialists (opt-in via `slots/`)
- **backend-engineer-agent** — activate from `slots/_backend-slot.md`
- **frontend-engineer-agent** — activate from `slots/_frontend-slot.md`
- **data-engineer-agent** — activate from `slots/_data-slot.md`

Activation: copy the slot file into `.claude/agents/`, fill the `<FILL: ...>` markers, set `specialists.<domain>: enabled` in CLAUDE.md frontmatter.

---

## Workflow Paths

| Path | When | Flow | Gate |
|---|---|---|---|
| **A: Feature** | New capability | orchestrator → specialist(s) → quality-auditor → pr-agent | Standard |
| **B: Bug** | Bug fix | orchestrator → specialist → quality-auditor → pr-agent | Standard |
| **C: Refactor** | Non-functional cleanup | orchestrator → specialist → quality-auditor → pr-agent | Standard |
| **D: Chore** | Docs / config / formatting | specialist (or direct) → pr-agent | Lite |

### Standard Gate
1. Show commits + diff stats:
   ```bash
   git log <default_branch>..HEAD --oneline
   git diff <default_branch> --stat
   ```
2. Run lint + tests (`commands.lint`, `commands.test`). All pass.
3. **User explicit approval** ("ready to PR" or similar).
4. `quality-auditor-agent` PASS → writes `.claude/review-passed.json`.
5. `pr-agent` verifies stamp matches HEAD SHA → creates PR.

### Lite Gate (Path D)
1. Show diff.
2. **User explicit approval**.
3. `pr-agent` creates PR (no auditor stamp required).

---

## Extension Guide

### Add Path E (DB migrations)
Required when the project has its own schema. Pattern:
```
Path: E (Schema Change)
Sequence: data-engineer-agent → quality-auditor-agent → pr-agent
Gate:    Standard + extra audit for migration reversibility
```
Activate `_data-slot.md`, then add to the routing table above.

### Add Path F (CI / DevOps)
Required when the project owns its CI pipeline. Add a `devops-agent` (write your own slot) and route on `"deploy X"`, `"CI for X"`, `"infra Y"`.

### Add Path G (Hotfix)
For trunk-based + production-pinned setups:
```
Path: G (Hotfix)
Branch: hotfix/<slug> based on default branch
Sequence: specialist → quality-auditor → pr-agent (target: default branch directly)
Gate:    Standard + paged user approval
```

### Add a New Specialist
1. Create `slots/_<domain>-slot.md` (copy `_backend-slot.md` as a starter).
2. Fill `<FILL: ...>` markers.
3. Add to **Roster → Specialists** above.
4. Add a row to the routing table or extend an existing path.
5. Add `<domain>: enabled` to `specialists` in CLAUDE.md frontmatter.

### Add a New Audit Dimension
Edit `.claude/agents/quality-auditor-agent.md`:
- Append `### Audit 6 — <Name>` (or higher) after the universal Audits 1–5.
- Update the report template at the end.
- Don't modify Audits 1–5 — they're portable across projects.

---

## Hard Rules

- `quality-auditor-agent` runs before `pr-agent` for Path A / B / C.
- `pr-agent` refuses to push to the default branch directly (any path).
- Path D requires explicit user approval since the auditor is skipped — silence is not consent.
- Specialist activation requires `specialists.<domain>: enabled` in CLAUDE.md; otherwise the orchestrator surfaces the missing-specialist fallback.
- Memory files are append-only by convention (ADR log especially); never rewrite history.
