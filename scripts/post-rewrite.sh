#!/bin/sh

# This hook is invoked by git commit --amend or git rebase, and can be bypassed with --no-verify option.
set -e
cog check
