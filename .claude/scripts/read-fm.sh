#!/usr/bin/env bash
# .claude/scripts/read-fm.sh — read a frontmatter value from CLAUDE.md without YAML deps.
# Usage:
#   read-fm.sh <key>                    # top-level scalar (e.g. project_name)
#   read-fm.sh <parent> <child>         # nested scalar (e.g. commands lint)
# Exits 0 on success and prints the value. Exits 1 if not found.

set -euo pipefail

PROJECT_ROOT="${CLAUDE_PROJECT_DIR:-$(git rev-parse --show-toplevel 2>/dev/null || pwd)}"
FILE="$PROJECT_ROOT/CLAUDE.md"

if [ ! -f "$FILE" ]; then
  echo "❌ CLAUDE.md not found at $FILE" >&2
  exit 1
fi

if [ "$#" -eq 1 ]; then
  KEY="$1"
  awk -v key="$KEY" '
    /^---$/ { fm = !fm; next }
    fm && $0 ~ "^"key":" {
      sub("^"key":[[:space:]]*", "")
      print
      found = 1
      exit
    }
    END { exit !found }
  ' "$FILE"
elif [ "$#" -eq 2 ]; then
  PARENT="$1"
  CHILD="$2"
  awk -v p="$PARENT" -v c="$CHILD" '
    /^---$/ { fm = !fm; next }
    fm && $0 ~ "^"p":" { in_parent = 1; next }
    fm && in_parent && /^[a-zA-Z]/ { in_parent = 0 }
    fm && in_parent && $0 ~ "^[[:space:]]+"c":" {
      sub("^[[:space:]]+"c":[[:space:]]*", "")
      print
      found = 1
      exit
    }
    END { exit !found }
  ' "$FILE"
else
  echo "Usage: $0 <key> | $0 <parent> <child>" >&2
  exit 1
fi
