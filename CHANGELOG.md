# Changelog

All notable changes to AgentLens are documented here.
Format follows [Keep a Changelog](https://keepachangelog.com/en/1.0.0/).

---

## [0.9.0](https://github.com/Vampire-V/AgentLens/compare/agentlens-v0.8.0...agentlens-v0.9.0) (2026-05-01)


### Features

* **analytics:** add vendor-agnostic analytics instrumentation ([#17](https://github.com/Vampire-V/AgentLens/issues/17)) ([2305229](https://github.com/Vampire-V/AgentLens/commit/2305229c787f85193b2cddc2cd8c802a157d3b37))
* **og:** dynamic OG image — thumbnail แสดงชื่อ workflow + agent/route counts ([#11](https://github.com/Vampire-V/AgentLens/issues/11)) ([83f3930](https://github.com/Vampire-V/AgentLens/commit/83f3930e17e6f6827edbf5ebc4b8130f4febce89))
* **seo:** add Google Search Console verification meta tag ([#16](https://github.com/Vampire-V/AgentLens/issues/16)) ([bdc1ecc](https://github.com/Vampire-V/AgentLens/commit/bdc1ecc164424c31464d28c90ad3a83cd95c9de6))
* **seo:** add OG/Twitter metadata, JSON-LD structured data, and canonical URLs ([4ddd6d5](https://github.com/Vampire-V/AgentLens/commit/4ddd6d597eae8483def62ffa4f8c47b7806487e8))
* **seo:** landing page, guide pages, and technical SEO ([#15](https://github.com/Vampire-V/AgentLens/issues/15)) ([6b6088e](https://github.com/Vampire-V/AgentLens/commit/6b6088ee56523af6f710d64e20934ced733e1274))
* **seo:** OG/Twitter metadata, JSON-LD structured data, canonical URLs ([6fc92af](https://github.com/Vampire-V/AgentLens/commit/6fc92afd3ab8337c4c4949f14922a95cf5407642))


### Bug Fixes

* **og:** extract metadata server-side แทนการ decompress ใน edge route ([#14](https://github.com/Vampire-V/AgentLens/issues/14)) ([b3f6d36](https://github.com/Vampire-V/AgentLens/commit/b3f6d360cbec85f9bb7d03f1000bacaa0343b7f2))
* **og:** plain URL now shows workflow thumbnail instead of blank ([#13](https://github.com/Vampire-V/AgentLens/issues/13)) ([433a808](https://github.com/Vampire-V/AgentLens/commit/433a80875e36de815389e1dfe2849c8eab7b85c1))
* **seo:** cast OpenGraph/Twitter to Record to fix strict tsc errors in tests ([7cc7804](https://github.com/Vampire-V/AgentLens/commit/7cc7804f3de2aa5151b6e0ed6273d45fd51c2ff3))

## [Unreleased]

### Added
- Vendor-agnostic analytics abstraction (`src/lib/analytics.ts`) with typed events and `setAnalyticsAdapter()` plug-in point — North Star metric (`workflow_rendered`), `yaml_error_shown`, and `editor_first_keystroke` instrumented across hooks and components.

---

## [0.8.0](https://github.com/Vampire-V/AgentLens/compare/agentlens-v0.7.0...agentlens-v0.8.0) (2026-04-26)


### Features

* v0.7.0 — URL compression, error highlighting, editor assist ([#10](https://github.com/Vampire-V/AgentLens/issues/10)) ([a2ce415](https://github.com/Vampire-V/AgentLens/commit/a2ce41516d1525797104f60a4f4eca3b618be03c))


### Bug Fixes

* **ci:** ใช้ PAT แทน GITHUB_TOKEN ใน release-please เพื่อให้ CI trigger บน Release PR ได้ ([#8](https://github.com/Vampire-V/AgentLens/issues/8)) ([35ac312](https://github.com/Vampire-V/AgentLens/commit/35ac312050d1abf9dc16e882d2362fde4657a1f5))

## [0.7.0](https://github.com/Vampire-V/AgentLens/compare/agentlens-v0.6.1...agentlens-v0.7.0) (2026-04-26)


### Features

* **canvas:** add AnimatedEdge with glowing dots and role-based colors ([3f35747](https://github.com/Vampire-V/AgentLens/commit/3f35747e73494b4200cb8881cdf15811e6a00683))
* **canvas:** add onNodeClick callback prop to FlowCanvas ([516db42](https://github.com/Vampire-V/AgentLens/commit/516db4220dd6a09e42dda9a7017036d648789af0))
* **canvas:** animated data flow with glowing dots ([6b1de0e](https://github.com/Vampire-V/AgentLens/commit/6b1de0ef9ae2d78af3434c50c3521a82ad8f3c62))
* **canvas:** wire AnimatedEdge as custom edgeType in FlowCanvas ([f0cdff7](https://github.com/Vampire-V/AgentLens/commit/f0cdff74ce4b5cfe993ea2b0b230712b9c796898))
* **inspector:** add AgentInspector slide-out panel with Shadcn Sheet ([86b925a](https://github.com/Vampire-V/AgentLens/commit/86b925abdb0332a53949ca084a5518213d64d351))
* **layout:** add elkLayout pure function and useElkLayout hook ([7fc6b52](https://github.com/Vampire-V/AgentLens/commit/7fc6b524cf911b0d3439d25e1ba32af9955de246))
* **node:** add role-based border colors and selected ring highlight ([06f8416](https://github.com/Vampire-V/AgentLens/commit/06f84164fef21e9061078ddab967b5246553f368))
* **parser:** add YAML schema, flow converter, and parser hook ([4eeeb08](https://github.com/Vampire-V/AgentLens/commit/4eeeb081ce5f7233403f2b97500a090de72bcda1))
* **parser:** inject sourceRole and type animated into flow edges ([d1beafb](https://github.com/Vampire-V/AgentLens/commit/d1beafb54a7bc1db56cb94d8cb8c702597e60468))
* scaffold Next.js 16 + XYFlow + Vitest baseline ([3586985](https://github.com/Vampire-V/AgentLens/commit/35869859811ee13944130f8eeb982b6273d45768))
* **schema:** add role, prompt fields and make model a free string ([220f95d](https://github.com/Vampire-V/AgentLens/commit/220f95dfc7ff2d497d3e13ef5ad1739f5a1e30c3))
* **transformer:** add role and prompt to AgentNodeData ([432b129](https://github.com/Vampire-V/AgentLens/commit/432b12959def1eef2abb13902bb2b147b464220f))
* **ui:** add split-pane canvas + editor MVP ([3c5f6df](https://github.com/Vampire-V/AgentLens/commit/3c5f6df7d907d87095741d3b46a0c0e9cf0e6b1d))
* **ui:** fitView refit on topology change + useCallback onChange ([862bc25](https://github.com/Vampire-V/AgentLens/commit/862bc251cee319d9f7e7644f4d11dde8b56213bc))
* **ui:** wire AgentInspector into SplitPane via node click ([debea8b](https://github.com/Vampire-V/AgentLens/commit/debea8b070d5131046683a43db027e7f1223e3d9))
* v0.4.0 — Agent Inspector + Role Styling ([7ccb98f](https://github.com/Vampire-V/AgentLens/commit/7ccb98feeaf64820dd93b5f9ae65ff40297d9084))
* v0.5.0 — Templates + Export PNG ([#2](https://github.com/Vampire-V/AgentLens/issues/2)) ([6268f86](https://github.com/Vampire-V/AgentLens/commit/6268f860ed957f152fa8193ae4102e3b77610e99))
* v0.6.0 — Dark Mode + Vercel Deploy ([#3](https://github.com/Vampire-V/AgentLens/issues/3)) ([1fa9955](https://github.com/Vampire-V/AgentLens/commit/1fa9955073b4a25f97e6e8f5252b0072c4635eb3))


### Bug Fixes

* **canvas:** move SVG defs outside g for cross-browser filter resolution ([72e9f3f](https://github.com/Vampire-V/AgentLens/commit/72e9f3fa81e109b578c4f1707c8725a348c9eaa4))
* **node:** use substring matching for model colors, wrap onClose in useCallback ([161fe38](https://github.com/Vampire-V/AgentLens/commit/161fe380e3ab95b6d42135b4b662aea2cc91a8d4))
* **parser:** debounce useYamlParser, add top-level edge label, fix audit command ([b6488dd](https://github.com/Vampire-V/AgentLens/commit/b6488dd093f6900800677e9d29f5f373cf8ab9fd))
* **parser:** narrow sourceRole type to AgentRole ([b88c6a2](https://github.com/Vampire-V/AgentLens/commit/b88c6a2643bd0f959c701b06d23fb8c4f0a5c2c6))
* **ui:** memo FlowCanvas, increase NODE_HEIGHT to 100 ([6c4a023](https://github.com/Vampire-V/AgentLens/commit/6c4a0232d6b69bc13bfd17e718796f680520fe43))

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
