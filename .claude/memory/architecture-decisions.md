# Architecture Decisions

> ADR log — record decisions that affect structure, technology choice, or system boundaries.
> Append-only: never edit a past ADR; supersede with a new one.

---

## ADR-0000 — Template Use

- **Date:** <YYYY-MM-DD>
- **Status:** Accepted
- **Context:** Project initialized from `~/.claude/templates/base/` v1.0.0.
- **Decision:** Adopt the template's universal agent roster (orchestrator, quality-auditor, pr-agent) and 4-path workflow (Feature, Bug, Refactor, Chore).
- **Consequences:** Specialists must be activated explicitly via `slots/`; deviations from the standard gates require an ADR.

---

## ADR-NNNN — <title>

- **Date:** <YYYY-MM-DD>
- **Status:** Proposed | Accepted | Superseded by ADR-XXXX
- **Context:** What problem are we solving? What constraints apply?
- **Decision:** What did we decide? Be specific.
- **Consequences:** What becomes easier? What becomes harder? What did we trade off?
