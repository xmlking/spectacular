#!/bin/sh

# This hook is invoked by git push, and can be bypassed with --no-verify option.
set -e
cog check
