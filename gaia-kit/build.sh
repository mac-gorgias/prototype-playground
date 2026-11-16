#!/bin/sh
# Rebuild gaia-kit/v1 from gaia-kit/src. Requires Node 18+ (esbuild is fetched via npx).
set -e
cd "$(dirname "$0")"
node build.mjs
