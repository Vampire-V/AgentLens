# Automated Releases (release-please) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** ตั้งค่า release-please ให้สร้าง Release PR + GitHub Release อัตโนมัติทุกครั้งที่ push เข้า main

**Architecture:** เพิ่ม 3 config files (release-please-config.json, .release-please-manifest.json, .github/workflows/release-please.yml) — release-please bot อ่าน Conventional Commits และ bump semver ให้อัตโนมัติ โดยเริ่มจาก v0.6.1 → release ถัดไปจะเป็น v0.7.0

**Tech Stack:** `googleapis/release-please-action@v4`, GitHub Actions

---

## File Map

| File | Action | Responsibility |
|------|--------|----------------|
| `release-please-config.json` | CREATE | บอก release-type และ changelog sections |
| `.release-please-manifest.json` | CREATE | บอก starting version = `0.6.1` |
| `package.json` | MODIFY | เปลี่ยน version เป็น `0.6.1` ให้ตรงกับ manifest |
| `.github/workflows/release-please.yml` | CREATE | Workflow trigger on push to main |

---

## Task 1: release-please config files

**Files:**
- Create: `release-please-config.json`
- Create: `.release-please-manifest.json`
- Modify: `package.json`

- [ ] **Step 1: สร้าง `release-please-config.json`**

```json
{
  "$schema": "https://raw.githubusercontent.com/googleapis/release-please/main/schemas/config.json",
  "release-type": "node",
  "packages": {
    ".": {
      "changelog-sections": [
        { "type": "feat", "section": "Features" },
        { "type": "fix", "section": "Bug Fixes" },
        { "type": "perf", "section": "Performance" },
        { "type": "deps", "section": "Dependencies" },
        { "type": "chore", "section": "Miscellaneous", "hidden": true }
      ]
    }
  }
}
```

- [ ] **Step 2: สร้าง `.release-please-manifest.json`**

```json
{
  ".": "0.6.1"
}
```

- [ ] **Step 3: อัปเดต version ใน `package.json`**

เปลี่ยน:
```json
"version": "0.1.0",
```
เป็น:
```json
"version": "0.6.1",
```

- [ ] **Step 4: Commit**

```bash
git add release-please-config.json .release-please-manifest.json package.json
git commit -m "chore(release): add release-please config, set starting version to 0.6.1"
```

---

## Task 2: GitHub Actions workflow

**Files:**
- Create: `.github/workflows/release-please.yml`

- [ ] **Step 1: สร้าง `.github/workflows/release-please.yml`**

```yaml
name: Release Please

on:
  push:
    branches: [main]

permissions:
  contents: write
  pull-requests: write

jobs:
  release-please:
    runs-on: ubuntu-latest
    steps:
      - uses: googleapis/release-please-action@v4
        with:
          config-file: release-please-config.json
          manifest-file: .release-please-manifest.json
```

- [ ] **Step 2: Commit**

```bash
git add .github/workflows/release-please.yml
git commit -m "ci(release): add release-please GitHub Actions workflow"
```

---

## Task 3: Push และตรวจสอบ

- [ ] **Step 1: Push branch และสร้าง PR**

```bash
git push -u origin <branch-name>
gh pr create \
  --title "ci(release): set up automated releases with release-please" \
  --body "$(cat <<'EOF'
## Summary
- เพิ่ม release-please-action@v4 workflow
- ตั้ง starting version เป็น 0.6.1 → release ถัดไปจะเป็น v0.7.0
- changelog sections: Features, Bug Fixes, Performance, Dependencies

## Test plan
- [ ] PR นี้ผ่าน CI (check job)
- [ ] หลัง merge — GitHub Actions รัน Release Please workflow
- [ ] release-please สร้าง PR ชื่อ `chore(main): release 0.7.0` อัตโนมัติ

🤖 Generated with [Claude Code](https://claude.com/claude-code)
EOF
)"
```

- [ ] **Step 2: รอ CI ผ่าน แล้ว merge PR**

```bash
gh pr checks <PR-number> --watch
gh pr merge <PR-number> --squash --delete-branch
```

- [ ] **Step 3: ตรวจสอบ Release Please workflow รัน**

```bash
gh run list --workflow=release-please.yml --limit 3
```

Expected: เห็น run สถานะ `completed / success`

- [ ] **Step 4: ตรวจสอบ Release PR ถูกสร้าง**

```bash
gh pr list --label "autorelease: pending"
```

Expected: เห็น PR ชื่อ `chore(main): release 0.7.0`

---

## Verification (End-to-End)

1. หลัง merge PR นี้ → Release Please workflow รันบน main
2. release-please เปิด PR ชื่อ `chore(main): release 0.7.0` พร้อม `CHANGELOG.md`
3. เมื่อ merge Release PR → GitHub สร้าง tag `v0.7.0` + Release page อัตโนมัติ
