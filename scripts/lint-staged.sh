#!/usr/bin/env bash

set -u

if [ "$#" -eq 0 ]; then
  echo "[lefthook] No staged files to lint."
  exit 0
fi

echo "[lefthook] Running ESLint on staged files..."
pnpm exec eslint --fix --quiet -- "$@"
eslint_status=$?
if [ $eslint_status -ne 0 ]; then
  echo "ESLint failed. Fix errors and commit again."
  exit $eslint_status
fi

echo "[lefthook] Running Prettier on staged files..."
pnpm exec prettier --write --log-level warn --ignore-unknown -- "$@"
prettier_status=$?
if [ $prettier_status -ne 0 ]; then
  echo "Prettier failed. Check formatting and commit again."
  exit $prettier_status
fi

echo "[lefthook] Lint/format checks passed."
