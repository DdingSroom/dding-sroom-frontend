#!/usr/bin/env bash

set -u

commit_msg_file="${1:-}"

if [ -z "$commit_msg_file" ] || [ ! -f "$commit_msg_file" ]; then
  echo "Commit message validation failed: commit message file is missing."
  exit 1
fi

first_line="$(head -n 1 "$commit_msg_file" | tr -d '\r')"

if [[ "$first_line" =~ ^Merge\  ]] || [[ "$first_line" =~ ^Revert\  ]]; then
  exit 0
fi

if [ -z "$first_line" ]; then
  echo "Commit message cannot be empty."
  exit 1
fi

if ! [[ "$first_line" =~ ^(init|feat|fix|chore|refactor|docs|perf|test):\  ]]; then
  echo "Invalid commit type."
  echo "Use: type: message"
  echo "Allowed types: init, feat, fix, chore, refactor, docs, perf, test"
  exit 1
fi

message="${first_line#*: }"

if [ -z "$message" ]; then
  echo "Commit message body is required after 'type: '."
  exit 1
fi

if [[ "$message" =~ [\`\;\<\>] ]]; then
  echo "Commit message contains disallowed special characters."
  exit 1
fi

exit 0
