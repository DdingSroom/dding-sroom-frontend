#!/usr/bin/env bash

set -u

if [ "$#" -eq 0 ]; then
  echo "No staged files to check ฅ^•ﻌ•^ฅ"
  exit 0
fi

eslint_files=()
prettier_files=()

for file in "$@"; do
  case "$file" in
    *.js|*.jsx|*.ts|*.tsx)
      eslint_files+=("$file")
      prettier_files+=("$file")
      ;;
    *.json|*.css|*.scss|*.md|*.mdx|*.yml|*.yaml)
      prettier_files+=("$file")
      ;;
  esac
done

echo "Checking staged files ฅ^•ﻌ•^ฅ"

if [ "${#eslint_files[@]}" -gt 0 ]; then
  eslint_log_file="/tmp/lefthook-eslint.log"
  rm -f "$eslint_log_file"

  pnpm exec eslint --fix --quiet -- "${eslint_files[@]}" >"$eslint_log_file" 2>&1
  eslint_status=$?

  if [ $eslint_status -ne 0 ]; then
    echo ""
    echo "ESLint failed ฅ(ᗒᗣᗕ)՞"
    echo "Fix lint errors and commit again."
    echo ""
    echo "Recent logs:"
    tail -n 80 "$eslint_log_file"
    echo ""
    echo "See details: $eslint_log_file"
    exit $eslint_status
  fi
fi

if [ "${#prettier_files[@]}" -gt 0 ]; then
  prettier_log_file="/tmp/lefthook-prettier.log"
  rm -f "$prettier_log_file"

  pnpm exec prettier --write --log-level warn --ignore-unknown -- "${prettier_files[@]}" >"$prettier_log_file" 2>&1
  prettier_status=$?

  if [ $prettier_status -ne 0 ]; then
    echo ""
    echo "Prettier failed ฅ(ᗒᗣᗕ)՞"
    echo "Check formatting and commit again."
    echo ""
    echo "Recent logs:"
    tail -n 80 "$prettier_log_file"
    echo ""
    echo "See details: $prettier_log_file"
    exit $prettier_status
  fi
fi

exit 0
