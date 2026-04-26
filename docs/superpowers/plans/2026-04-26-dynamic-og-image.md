# Dynamic OG Image Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a `/api/og` edge route that generates a dynamic 1200×630 OG image showing the workflow name and agent/route counts decoded from the URL-compressed YAML, so every shared AgentLens link gets a unique thumbnail.

**Architecture:** A pure helper `extractWorkflowMeta` decompresses and parses the YAML (testable in Vitest). A Next.js edge route `GET /api/og` calls that helper and renders an `ImageResponse` via `next/og`. `generateMetadata` in `page.tsx` reads `searchParams.yaml` and wires the dynamic `/api/og?yaml=...` URL into the `<head>`.

**Tech Stack:** Next.js 16 `next/og` (built-in, no install), `lz-string` (existing), `js-yaml` (existing), Vitest

---

## File Map

| File | Action | Purpose |
|---|---|---|
| `src/app/api/og/extract-workflow-meta.ts` | Create | Pure decompress+parse helper |
| `src/app/api/og/__tests__/extract-workflow-meta.test.ts` | Create | Unit tests for helper |
| `src/app/api/og/route.tsx` | Create | Edge GET handler + ImageResponse |
| `src/app/page.tsx` | Modify | Add `generateMetadata` |

---

### Task 1: Write failing tests for `extractWorkflowMeta`

**Files:**
- Create: `src/app/api/og/__tests__/extract-workflow-meta.test.ts`
- Create stub: `src/app/api/og/extract-workflow-meta.ts`

- [ ] **Step 1: Create empty stub so import resolves**

Create `src/app/api/og/extract-workflow-meta.ts`:

```ts
export interface WorkflowMeta {
  name: string
  agentCount: number
  routeCount: number
}

export function extractWorkflowMeta(
  _compressed: string | null | undefined
): WorkflowMeta | null {
  throw new Error('not implemented')
}
```

- [ ] **Step 2: Write the test file**

Create `src/app/api/og/__tests__/extract-workflow-meta.test.ts`:

```ts
import { describe, it, expect } from 'vitest'
import LZString from 'lz-string'
import { extractWorkflowMeta } from '../extract-workflow-meta'

function compress(yaml: string) {
  return LZString.compressToEncodedURIComponent(yaml)
}

describe('extractWorkflowMeta', () => {
  it('valid_yaml__extracts_name_agents_routes__returns_meta', () => {
    const yaml = `
name: "AI Research Pipeline"
agents:
  - id: a
  - id: b
routes:
  - id: r1
  - id: r2
  - id: r3
`
    const result = extractWorkflowMeta(compress(yaml))
    expect(result).toEqual({ name: 'AI Research Pipeline', agentCount: 2, routeCount: 3 })
  })

  it('null_input__called_with_null__returns_null', () => {
    expect(extractWorkflowMeta(null)).toBeNull()
  })

  it('undefined_input__called_with_undefined__returns_null', () => {
    expect(extractWorkflowMeta(undefined)).toBeNull()
  })

  it('yaml_missing_agents_and_routes__extracts_name__returns_zero_counts', () => {
    const yaml = `name: "Empty Pipeline"`
    const result = extractWorkflowMeta(compress(yaml))
    expect(result).toEqual({ name: 'Empty Pipeline', agentCount: 0, routeCount: 0 })
  })

  it('yaml_missing_name__extracts_with_fallback__returns_default_name', () => {
    const yaml = `
agents:
  - id: a
routes: []
`
    const result = extractWorkflowMeta(compress(yaml))
    expect(result).toEqual({ name: 'Untitled Workflow', agentCount: 1, routeCount: 0 })
  })

  it('garbage_string__decompress_fails__returns_null', () => {
    expect(extractWorkflowMeta('!!not-yaml!!')).toBeNull()
  })
})
```

- [ ] **Step 3: Run tests — verify they fail**

```bash
npx vitest run src/app/api/og/__tests__/extract-workflow-meta.test.ts
```

Expected: all 6 tests **FAIL** with `Error: not implemented`

---

### Task 2: Implement `extractWorkflowMeta`

**Files:**
- Modify: `src/app/api/og/extract-workflow-meta.ts`

- [ ] **Step 1: Replace stub with implementation**

Replace the contents of `src/app/api/og/extract-workflow-meta.ts`:

```ts
import LZString from 'lz-string'
import * as yaml from 'js-yaml'

export interface WorkflowMeta {
  name: string
  agentCount: number
  routeCount: number
}

export function extractWorkflowMeta(
  compressed: string | null | undefined
): WorkflowMeta | null {
  try {
    if (!compressed) return null
    const raw = LZString.decompressFromEncodedURIComponent(compressed) ?? compressed
    const doc = yaml.load(raw)
    if (!doc || typeof doc !== 'object' || Array.isArray(doc)) return null
    const d = doc as Record<string, unknown>
    return {
      name: typeof d.name === 'string' ? d.name : 'Untitled Workflow',
      agentCount: Array.isArray(d.agents) ? d.agents.length : 0,
      routeCount: Array.isArray(d.routes) ? d.routes.length : 0,
    }
  } catch {
    return null
  }
}
```

- [ ] **Step 2: Run tests — verify all pass**

```bash
npx vitest run src/app/api/og/__tests__/extract-workflow-meta.test.ts
```

Expected: **6 passed, 0 failed**

- [ ] **Step 3: Commit**

```bash
git add src/app/api/og/extract-workflow-meta.ts src/app/api/og/__tests__/extract-workflow-meta.test.ts
git commit -m "feat(og): add extractWorkflowMeta — decompress + parse YAML เพื่อดึง workflow name และ counts"
```

---

### Task 3: Implement the OG API route

**Files:**
- Create: `src/app/api/og/route.tsx`

- [ ] **Step 1: Create the route file**

Create `src/app/api/og/route.tsx`:

```tsx
import { ImageResponse } from 'next/og'
import { extractWorkflowMeta } from './extract-workflow-meta'

export const runtime = 'edge'

export function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const compressed = searchParams.get('yaml')
  const meta = extractWorkflowMeta(compressed)

  return new ImageResponse(
    meta ? (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          padding: '60px 80px',
          background: 'linear-gradient(135deg, #0f0f0f 0%, #1a1a2e 100%)',
          fontFamily: 'monospace',
        }}
      >
        <div
          style={{
            fontSize: 14,
            letterSpacing: 3,
            color: '#7c83fd',
            fontWeight: 600,
            marginBottom: 16,
            textTransform: 'uppercase',
          }}
        >
          AgentLens
        </div>
        <div
          style={{
            fontSize: 52,
            fontWeight: 700,
            color: '#ffffff',
            marginBottom: 24,
            lineHeight: 1.1,
          }}
        >
          {meta.name}
        </div>
        <div style={{ display: 'flex', gap: 12 }}>
          <span
            style={{
              fontSize: 18,
              color: '#7c83fd',
              background: 'rgba(124,131,253,0.15)',
              padding: '6px 16px',
              borderRadius: 20,
            }}
          >
            {meta.agentCount} agents
          </span>
          <span
            style={{
              fontSize: 18,
              color: '#aaaaaa',
              background: 'rgba(255,255,255,0.08)',
              padding: '6px 16px',
              borderRadius: 20,
            }}
          >
            {meta.routeCount} routes
          </span>
        </div>
        <div style={{ marginTop: 'auto', fontSize: 14, color: '#444444' }}>
          agent-lens-murex.vercel.app
        </div>
      </div>
    ) : (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          padding: '60px 80px',
          background: 'linear-gradient(135deg, #0f0f0f 0%, #1a1a2e 100%)',
          fontFamily: 'monospace',
        }}
      >
        <div
          style={{
            fontSize: 14,
            letterSpacing: 3,
            color: '#7c83fd',
            fontWeight: 600,
            marginBottom: 16,
            textTransform: 'uppercase',
          }}
        >
          Agent Orchestration
        </div>
        <div
          style={{
            fontSize: 52,
            fontWeight: 700,
            color: '#ffffff',
            marginBottom: 16,
          }}
        >
          AgentLens
        </div>
        <div style={{ fontSize: 22, color: '#aaaaaa' }}>
          Visual YAML editor for AI agent orchestration workflows
        </div>
        <div style={{ marginTop: 'auto', fontSize: 14, color: '#444444' }}>
          agent-lens-murex.vercel.app
        </div>
      </div>
    ),
    { width: 1200, height: 630 }
  )
}
```

- [ ] **Step 2: Type-check**

```bash
npx tsc --noEmit
```

Expected: no errors

- [ ] **Step 3: Commit**

```bash
git add src/app/api/og/route.tsx
git commit -m "feat(og): add /api/og edge route — dynamic ImageResponse ด้วย next/og"
```

---

### Task 4: Add `generateMetadata` to `page.tsx`

**Files:**
- Modify: `src/app/page.tsx`

- [ ] **Step 1: Add `generateMetadata` export**

Open `src/app/page.tsx` and add this export **before** the `export default function Home()` line:

```tsx
import type { Metadata } from 'next'
import { Suspense } from 'react'
import { SplitPane } from '@/components/split-pane'

export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<{ yaml?: string }>
}): Promise<Metadata> {
  const { yaml } = await searchParams
  const ogUrl = yaml
    ? `/api/og?yaml=${encodeURIComponent(yaml)}`
    : `/api/og`
  return {
    openGraph: {
      title: 'AgentLens',
      description: 'Visual YAML editor for AI agent orchestration workflows',
      images: [{ url: ogUrl, width: 1200, height: 630 }],
    },
    twitter: { card: 'summary_large_image', images: [ogUrl] },
  }
}

export default function Home() {
  return (
    <main className="flex h-full flex-col">
      <header className="flex items-center border-b border-border bg-background px-4 py-2">
        <span className="text-sm font-semibold text-foreground">AgentLens</span>
        <span className="ml-2 text-xs text-muted-foreground">YAML → Graph</span>
      </header>
      <div className="flex-1 overflow-hidden">
        <Suspense>
          <SplitPane />
        </Suspense>
      </div>
    </main>
  )
}
```

- [ ] **Step 2: Type-check**

```bash
npx tsc --noEmit
```

Expected: no errors

- [ ] **Step 3: Run full test suite**

```bash
npx vitest run
```

Expected: all tests pass (no regressions)

- [ ] **Step 4: Commit**

```bash
git add src/app/page.tsx
git commit -m "feat(og): add generateMetadata ใน page.tsx — og:image dynamic ตาม yaml URL param"
```

---

### Task 5: Manual verification

- [ ] **Step 1: Start dev server**

```bash
npm run dev
```

- [ ] **Step 2: Verify fallback OG image**

เปิด `http://localhost:3000/api/og` ใน browser

Expected: เห็นรูป 1200×630 แสดง "AgentLens" + tagline (fallback branding)

- [ ] **Step 3: Verify dynamic OG image**

เปิด AgentLens (`http://localhost:3000`) → URL จะเปลี่ยนเป็น `?yaml=...` — copy ค่า `yaml` param

เปิด `http://localhost:3000/api/og?yaml=<ค่าที่ copy มา>` ใน browser

Expected: เห็นรูปแสดงชื่อ workflow + จำนวน agent/route ตรงกับ YAML ใน editor

- [ ] **Step 4: Verify deep link**

1. แก้ YAML ใน editor → URL เปลี่ยน
2. Copy URL ทั้งหมด → เปิด tab ใหม่ → paste
3. Expected: flow render เหมือนเดิมทุกประการ ✅

- [ ] **Step 5: Add `.superpowers/` to `.gitignore` (if not already there)**

```bash
grep -q '.superpowers' .gitignore || echo '.superpowers/' >> .gitignore
git add .gitignore
git commit -m "chore: add .superpowers/ to .gitignore"
```
