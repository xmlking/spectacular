#!/bin/sh

# This hook is invoked by git commit, and can be bypassed with --no-verify option.
set -e
cog verify --file $1
cog check
turbo run format
turbo run lint
