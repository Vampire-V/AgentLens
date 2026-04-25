#!/usr/bin/env bash
# .claude/hooks/create-review-stamp.sh
# Called by quality-auditor-agent on PASS verdict.
# Writes .claude/review-passed.json that pr-agent verifies before opening a PR.

set -euo pipefail

PROJECT_ROOT="${CLAUDE_PROJECT_DIR:-$(git rev-parse --show-toplevel 2>/dev/null || pwd)}"
REVIEW_FILE="$PROJECT_ROOT/.claude/review-passed.json"
CURRENT_SHA=$(cd "$PROJECT_ROOT" && git rev-parse HEAD)
TIMESTAMP=$(date -u +"%Y-%m-%dT%H:%M:%SZ")

cat > "$REVIEW_FILE" <<EOF
{
  "passed_at": "$TIMESTAMP",
  "last_reviewed_sha": "$CURRENT_SHA",
  "dimensions": {
    "lint": "PASS",
    "tests": "PASS",
    "security": "PASS",
    "scope": "PASS"
  }
}
EOF

echo "Review stamp created: $REVIEW_FILE"
echo "  SHA: $CURRENT_SHA"
echo "  Time: $TIMESTAMP"
