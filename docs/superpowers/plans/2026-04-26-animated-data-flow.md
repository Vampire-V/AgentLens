# Animated Data Flow Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add glowing dot particles that animate along every edge in the XYFlow canvas, colored by the source agent's role, with hover-reveal label tooltips.

**Architecture:** Create `AnimatedEdge` — a custom XYFlow edge component using SVG `animateMotion` + `mpath` to move three staggered dot particles along the Bezier curve path. Update `yaml-to-flow.ts` to inject `sourceRole` and `type: 'animated'` into each edge. Register `edgeTypes` in `flow-canvas.tsx`.

**Tech Stack:** XYFlow 12 (`EdgeProps`, `getBezierPath`, `EdgeLabelRenderer`), SVG `animateMotion`/`mpath`/`feGaussianBlur`, Vitest + React Testing Library, Playwright

---

## File Map

| File | Action | Responsibility |
|---|---|---|
| `src/lib/yaml-to-flow.ts` | Modify | Inject `sourceRole` + `type: 'animated'` into edges |
| `src/lib/__tests__/yaml-to-flow.test.ts` | Modify | Add test for sourceRole injection |
| `src/components/animated-edge.tsx` | **Create** | Custom edge: SVG path + animated dots + hover tooltip |
| `src/components/__tests__/animated-edge.test.tsx` | **Create** | Unit tests for AnimatedEdge |
| `src/components/flow-canvas.tsx` | Modify | Register `edgeTypes = { animated: AnimatedEdge }` |
| `e2e/animated-edge.spec.ts` | **Create** | E2E: verify animation in browser |

---

## Task 1: Update yaml-to-flow.ts — inject sourceRole into edges

**Files:**
- Modify: `src/lib/yaml-to-flow.ts`
- Modify: `src/lib/__tests__/yaml-to-flow.test.ts`

- [ ] **Step 1: Write failing test**

Add this test to `src/lib/__tests__/yaml-to-flow.test.ts`:

```ts
it('manager_source_route__workflowToFlowGraph__edge_has_sourceRole_manager', () => {
  const workflow = WorkflowSchema.parse({
    version: '1.0.0',
    name: 'Test',
    agents: [
      { id: 'mgr', name: 'Manager', role: 'manager', tools: [] },
      { id: 'wkr', name: 'Worker', role: 'worker', tools: [] },
    ],
    routes: [
      { id: 'r1', source: 'mgr', target: 'wkr', label: 'task' },
    ],
  });
  const { edges } = workflowToFlowGraph(workflow);
  expect(edges[0].data?.sourceRole).toBe('manager');
  expect(edges[0].type).toBe('animated');
});
```

- [ ] **Step 2: Run test — verify it fails**

```bash
npm run test -- --reporter=verbose src/lib/__tests__/yaml-to-flow.test.ts
```

Expected: FAIL — `edges[0].data?.sourceRole` is `undefined`

- [ ] **Step 3: Update FlowEdge type and workflowToFlowGraph**

Replace the content of `src/lib/yaml-to-flow.ts` with:

```ts
import type { Node, Edge } from '@xyflow/react';
import type { Workflow, AgentRole } from './yaml-schema';

export type AgentNodeData = {
  name: string;
  description?: string;
  model?: string;
  role?: AgentRole;
  prompt?: string;
  tools?: string[];
};

export type FlowNode = Node<AgentNodeData, 'agent'>;
export type FlowEdge = Edge<{ label: string; condition?: string; sourceRole?: string }>;

export function workflowToFlowGraph(workflow: Workflow): { nodes: FlowNode[]; edges: FlowEdge[] } {
  const nodes: FlowNode[] = workflow.agents.map((agent) => ({
    id: agent.id,
    type: 'agent',
    position: { x: 0, y: 0 },
    data: {
      name: agent.name,
      description: agent.description,
      model: agent.model,
      role: agent.role,
      prompt: agent.prompt,
      tools: agent.tools,
    },
  }));

  const agentRoleMap = Object.fromEntries(workflow.agents.map((a) => [a.id, a.role]));

  const edges: FlowEdge[] = workflow.routes.map((route) => ({
    id: route.id,
    type: 'animated',
    source: route.source,
    target: route.target,
    label: route.label,
    data: { label: route.label, condition: route.condition, sourceRole: agentRoleMap[route.source] },
  }));

  return { nodes, edges };
}
```

- [ ] **Step 4: Run tests — verify all pass**

```bash
npm run test -- --reporter=verbose src/lib/__tests__/yaml-to-flow.test.ts
```

Expected: All 9 tests PASS (8 existing + 1 new)

- [ ] **Step 5: Commit**

```bash
git add src/lib/yaml-to-flow.ts src/lib/__tests__/yaml-to-flow.test.ts
git commit -m "feat(parser): inject sourceRole and type animated into flow edges"
```

---

## Task 2: Create AnimatedEdge component + unit tests

**Files:**
- Create: `src/components/animated-edge.tsx`
- Create: `src/components/__tests__/animated-edge.test.tsx`

- [ ] **Step 1: Write failing unit tests**

Create `src/components/__tests__/animated-edge.test.tsx`:

```tsx
import { describe, it, expect, vi } from 'vitest';
import { render } from '@testing-library/react';
import React from 'react';

// Mock @xyflow/react before importing component
vi.mock('@xyflow/react', () => ({
  getBezierPath: vi.fn(() => ['M0 0 C50 0 50 100 100 100', 50, 50] as [string, number, number]),
  EdgeLabelRenderer: ({ children }: { children: React.ReactNode }) => <>{children}</>,
  Position: { Left: 'left', Right: 'right', Top: 'top', Bottom: 'bottom' },
}));

import { AnimatedEdge } from '../animated-edge';

const baseProps = {
  id: 'test-edge',
  sourceX: 0,
  sourceY: 0,
  targetX: 100,
  targetY: 100,
  sourcePosition: 'right' as const,
  targetPosition: 'left' as const,
  source: 'agent1',
  target: 'agent2',
  selected: false,
  animated: false,
  interactionWidth: 20,
  markerEnd: undefined,
  data: undefined,
};

describe('AnimatedEdge', () => {
  it('no_data__render__path_and_three_animate_motion', () => {
    const { container } = render(
      <svg><AnimatedEdge {...baseProps} /></svg>
    );
    expect(container.querySelector('path#edge-path-test-edge')).toBeTruthy();
    const motions = container.querySelectorAll('animateMotion');
    expect(motions).toHaveLength(3);
  });

  it('manager_source__render__purple_dot', () => {
    const { container } = render(
      <svg><AnimatedEdge {...baseProps} data={{ sourceRole: 'manager' }} /></svg>
    );
    const circles = container.querySelectorAll('circle');
    circles.forEach((c) => expect(c.getAttribute('fill')).toBe('#a78bfa'));
  });

  it('worker_source__render__blue_dot', () => {
    const { container } = render(
      <svg><AnimatedEdge {...baseProps} data={{ sourceRole: 'worker' }} /></svg>
    );
    const circles = container.querySelectorAll('circle');
    circles.forEach((c) => expect(c.getAttribute('fill')).toBe('#60a5fa'));
  });

  it('no_label__render__no_tooltip', () => {
    const { container } = render(
      <svg><AnimatedEdge {...baseProps} data={{ sourceRole: 'worker' }} /></svg>
    );
    expect(container.querySelector('.nodrag')).toBeNull();
  });

  it('with_label__render__tooltip_element', () => {
    const { container } = render(
      <svg><AnimatedEdge {...baseProps} data={{ sourceRole: 'worker', label: 'research brief' }} /></svg>
    );
    expect(container.querySelector('.nodrag')).toBeTruthy();
    expect(container.textContent).toContain('research brief');
  });
});
```

- [ ] **Step 2: Run tests — verify they fail**

```bash
npm run test -- --reporter=verbose src/components/__tests__/animated-edge.test.tsx
```

Expected: FAIL — `Cannot find module '../animated-edge'`

- [ ] **Step 3: Create AnimatedEdge component**

Create `src/components/animated-edge.tsx`:

```tsx
'use client'; // XYFlow requires client-side rendering

import { memo } from 'react';
import { getBezierPath, EdgeLabelRenderer } from '@xyflow/react';
import type { EdgeProps } from '@xyflow/react';

const ROLE_DOT_COLORS: Record<string, string> = {
  manager: '#a78bfa',
  worker:  '#60a5fa',
  critic:  '#fb923c',
  tool:    '#4ade80',
  custom:  '#94a3b8',
};

const DOT_DELAYS = [0, 0.5, 1.0];

export type AnimatedEdgeData = {
  label?: string;
  sourceRole?: string;
};

function AnimatedEdgeComponent({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  data,
  markerEnd,
}: EdgeProps<AnimatedEdgeData>) {
  const [edgePath, labelX, labelY] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });

  const color = ROLE_DOT_COLORS[data?.sourceRole ?? ''] ?? '#94a3b8';
  const pathId = `edge-path-${id}`;
  const filterId = `glow-${id}`;

  return (
    <>
      <g>
        <defs>
          <filter id={filterId}>
            <feGaussianBlur stdDeviation="2" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        <path
          id={pathId}
          d={edgePath}
          stroke="#334155"
          strokeWidth={1.5}
          fill="none"
          markerEnd={markerEnd}
        />
        {DOT_DELAYS.map((delay, i) => (
          <circle key={i} r={4} fill={color} filter={`url(#${filterId})`}>
            <animateMotion dur="1.5s" begin={`${delay}s`} repeatCount="indefinite">
              <mpath href={`#${pathId}`} />
            </animateMotion>
          </circle>
        ))}
      </g>
      {data?.label && (
        <EdgeLabelRenderer>
          <div
            style={{
              transform: `translate(-50%, -50%) translate(${labelX}px, ${labelY}px)`,
              pointerEvents: 'all',
              position: 'absolute',
            }}
            className="nodrag nopan group"
          >
            <span className="opacity-0 group-hover:opacity-100 transition-opacity bg-zinc-800 text-zinc-200 text-xs px-2 py-0.5 rounded whitespace-nowrap">
              {data.label}
            </span>
          </div>
        </EdgeLabelRenderer>
      )}
    </>
  );
}

export const AnimatedEdge = memo(AnimatedEdgeComponent);
```

- [ ] **Step 4: Run tests — verify all pass**

```bash
npm run test -- --reporter=verbose src/components/__tests__/animated-edge.test.tsx
```

Expected: 5 tests PASS

- [ ] **Step 5: Commit**

```bash
git add src/components/animated-edge.tsx src/components/__tests__/animated-edge.test.tsx
git commit -m "feat(canvas): add AnimatedEdge with glowing dots and role-based colors"
```

---

## Task 3: Wire AnimatedEdge into flow-canvas.tsx

**Files:**
- Modify: `src/components/flow-canvas.tsx`

- [ ] **Step 1: Add edgeTypes and import AnimatedEdge**

Edit `src/components/flow-canvas.tsx`. Make these two changes:

**Change 1 — add import** (after existing imports):
```ts
import { AnimatedEdge } from './animated-edge';
```

**Change 2 — add edgeTypes** (right after the existing `nodeTypes` line):
```ts
// must be at module level — object identity must be stable across renders
const nodeTypes = { agent: AgentNode };
const edgeTypes = { animated: AnimatedEdge };
```

**Change 3 — pass edgeTypes to ReactFlow** (add `edgeTypes={edgeTypes}` alongside `nodeTypes`):
```tsx
<ReactFlow
  nodes={nodes}
  edges={edges}
  onNodesChange={onNodesChange}
  onEdgesChange={onEdgesChange}
  onNodeClick={handleNodeClick}
  nodeTypes={nodeTypes}
  edgeTypes={edgeTypes}
  colorMode={colorMode}
>
```

- [ ] **Step 2: Run full test suite**

```bash
npm run test
```

Expected: All existing tests still PASS (no regressions)

- [ ] **Step 3: Type-check**

```bash
npm run type-check
```

Expected: No TypeScript errors

- [ ] **Step 4: Verify in browser**

```bash
npm run dev
```

Open http://localhost:3000 — you should see glowing purple, blue, orange dots animating along edges. Hover over any edge to reveal the label tooltip.

- [ ] **Step 5: Commit**

```bash
git add src/components/flow-canvas.tsx
git commit -m "feat(canvas): wire AnimatedEdge as custom edgeType in FlowCanvas"
```

---

## Task 4: E2E tests

**Files:**
- Create: `e2e/animated-edge.spec.ts`

- [ ] **Step 1: Create E2E test file**

Create `e2e/animated-edge.spec.ts`:

```ts
import { test, expect } from '@playwright/test';

test('default_yaml__load__animateMotion_elements_present', async ({ page }) => {
  await page.goto('/');
  await page.waitForLoadState('networkidle');
  // Wait for XYFlow canvas to render
  await page.waitForSelector('.react-flow__edges', { timeout: 5000 });

  const motionCount = await page.locator('animateMotion').count();
  expect(motionCount).toBeGreaterThan(0);
});

test('coordinator_edge__load__circles_have_purple_fill', async ({ page }) => {
  await page.goto('/');
  await page.waitForLoadState('networkidle');
  await page.waitForSelector('.react-flow__edges', { timeout: 5000 });

  // Coordinator is a manager — its outgoing edge dots should be #a78bfa
  const circles = page.locator('circle[fill="#a78bfa"]');
  await expect(circles.first()).toBeVisible();
});

test('edge_with_label__hover__tooltip_becomes_visible', async ({ page }) => {
  await page.goto('/');
  await page.waitForLoadState('networkidle');
  await page.waitForSelector('.react-flow__edges', { timeout: 5000 });

  // Tooltip spans exist but are initially invisible (opacity-0)
  const tooltips = page.locator('.nodrag span');
  const count = await tooltips.count();
  expect(count).toBeGreaterThan(0);

  // Hover parent group to trigger group-hover:opacity-100
  const tooltipGroup = page.locator('.nodrag').first();
  await tooltipGroup.hover();

  // After hover, the span should have opacity-100 class (transition applied)
  await expect(tooltips.first()).toHaveClass(/opacity-100/);
});
```

- [ ] **Step 2: Run E2E tests (dev server must be running)**

In a separate terminal, start the dev server if not already running:
```bash
npm run dev
```

Then run:
```bash
npx playwright test e2e/animated-edge.spec.ts --reporter=list
```

Expected: 3 tests PASS

- [ ] **Step 3: Commit**

```bash
git add e2e/animated-edge.spec.ts
git commit -m "test(e2e): add Playwright tests for animated data flow edges"
```

---

## Final Verification

```bash
npm run lint        # ESLint + type-check
npm run test        # All Vitest unit tests
npm run build       # Production build
```

All three must pass before the feature is complete.
