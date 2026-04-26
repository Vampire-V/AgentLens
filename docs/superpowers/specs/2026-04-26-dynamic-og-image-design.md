# Dynamic OG Image — Design Spec

**Date:** 2026-04-26
**Scope:** Add dynamic Open Graph image for social sharing + verify deep link

## Goal

When a user shares an AgentLens URL (e.g. in LINE, Slack, iMessage), the link preview thumbnail should show the **workflow name and agent/route count** from the YAML encoded in the URL — not a generic placeholder. Every unique shared link produces a unique thumbnail.

## Out of Scope

- CTA buttons (GitHub Star, feedback link) — removed from scope
- Exposing source code links anywhere in the UI

## Architecture

Two files change; no new shared utilities needed.

### 1. `app/api/og/route.tsx` (new)

GET handler powered by `@vercel/og` (`ImageResponse`).

**Request:** `GET /api/og?yaml=<lz-compressed-yaml>`

**Logic:**
1. Read `yaml` search param.
2. Decompress with `LZString.decompressFromEncodedURIComponent` (same library already used in `lib/compressed-yaml-parser.ts`).
3. Parse with `js-yaml` — extract `name`, `agents.length`, `routes.length`.
4. Render `ImageResponse` (1200×630) with:
   - "AgentLens" label (small, branded color)
   - Workflow name (large, bold)
   - Badge row: "N agents" · "M routes"
   - Domain footer
   - Dark gradient background
5. **Fallback:** if `yaml` is absent or parse throws, render fixed branding (logo + tagline only) — same dimensions, no crash.

**Runtime:** Edge (`export const runtime = 'edge'`).

### 2. `app/page.tsx` (modified)

Add `generateMetadata` export alongside the existing default export.

```ts
export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<{ yaml?: string }>
}) {
  const { yaml } = await searchParams
  const ogUrl = yaml ? `/api/og?yaml=${yaml}` : `/api/og`
  return {
    openGraph: {
      title: 'AgentLens',
      description: 'Visual YAML editor for AI agent orchestration workflows',
      images: [{ url: ogUrl, width: 1200, height: 630 }],
    },
    twitter: { card: 'summary_large_image', images: [ogUrl] },
  }
}
```

`layout.tsx` keeps its existing static `metadata` (title + description). `page.tsx` overrides OG-specific fields only.

## Deep Link Verification (no code)

`nuqs` URL state is already implemented in `split-pane.tsx:103`. After the OG image is deployed, verify manually:

1. Type YAML in editor → URL changes to `?yaml=...`
2. Copy URL → open new tab → flow renders identically → ✅

## Dependencies

| Package | Status |
|---|---|
| `@vercel/og` | Install (new) |
| `lz-string` | Already installed |
| `js-yaml` | Already installed |

## Error Handling

- Decompress returns `null` → catch → render fallback
- `js-yaml` parse throws → catch → render fallback
- API route never throws 500 to crawler — always returns an image

## Testing

- Unit test for the decompress+parse logic (pure function, extract if needed)
- Manual browser test: share URL in LINE/Telegram, confirm thumbnail matches YAML content
- Verify fallback: `/api/og` with no param returns valid 1200×630 image
