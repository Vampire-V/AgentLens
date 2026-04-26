# Automated Releases via release-please

**Date:** 2026-04-26
**Status:** Approved

## Goal

ทุกครั้งที่ merge เข้า `main`, release-please bot สร้าง/อัปเดต "Release PR" พร้อม changelog อัตโนมัติ เมื่อ merge Release PR → สร้าง git tag + GitHub Release ให้เอง โดยไม่ต้องทำด้วยตนเอง

## Architecture

```
push to main
    │
    ▼
release-please workflow
    │
    ├─ อ่าน Conventional Commits ตั้งแต่ release ล่าสุด
    ├─ bump version ตาม semver (feat→minor, fix→patch, BREAKING→major)
    └─ สร้าง/อัปเดต Release PR
            │
            ▼ (เมื่อ merge)
        git tag + GitHub Release + CHANGELOG.md update
```

## Files

| File | Action | Description |
|------|--------|-------------|
| `.github/workflows/release-please.yml` | CREATE | Workflow trigger on push to main |
| `.release-please-manifest.json` | CREATE | Starting version = `0.6.1` |
| `release-please-config.json` | CREATE | Package type: node, changelog sections |

## Configuration Details

**`release-please-config.json`**
- `release-type: node` — อ่าน version จาก `package.json` และ bump อัตโนมัติ
- changelog sections: `feat`, `fix`, `perf`, `deps`
- bump rules: `feat` → minor, `fix`/`perf` → patch, `BREAKING CHANGE` → major

**`.release-please-manifest.json`**
- Starting point: `{ ".": "0.6.1" }` → release ถัดไปจะเป็น `v0.7.0`

**Workflow**
- Trigger: `push` to `main`
- Permissions: `contents: write`, `pull-requests: write`
- Uses: `googleapis/release-please-action@v4`

## Flow ปกติหลัง Setup

1. Merge feature/fix PR เข้า main ตามปกติ
2. release-please bot เปิด/อัปเดต PR ชื่อ `chore(main): release X.Y.Z` อัตโนมัติ
3. เมื่อพร้อม release → merge Release PR
4. GitHub Release + tag สร้างอัตโนมัติ

## Out of Scope

- ไม่สร้าง release ย้อนหลังสำหรับ v0.4.0–v0.6.1
- ไม่ publish npm package
- ไม่ deploy on release (เป็น Vercel auto-deploy จาก main อยู่แล้ว)
