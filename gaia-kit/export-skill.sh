#!/bin/sh
# Package the gaia-story skill + the kit into one zip for people outside the playground repo.
# Output: gaia-kit/dist/gaia-story-skill.zip → unzip into ~/.claude/skills/ (creates gaia-story/).
set -e
cd "$(dirname "$0")"
ROOT="$(cd .. && pwd)"
STAGE="$(mktemp -d)/gaia-story"
mkdir -p "$STAGE/kit" dist
cp -R "$ROOT/.claude/skills/gaia-story/." "$STAGE/"
cp -R v1 stories modules use-cases examples README.md "$STAGE/kit/"
rm -f dist/gaia-story-skill.zip
(cd "$(dirname "$STAGE")" && zip -qr "$ROOT/gaia-kit/dist/gaia-story-skill.zip" gaia-story -x '*.DS_Store')
rm -rf "$(dirname "$STAGE")"
echo "Wrote gaia-kit/dist/gaia-story-skill.zip ($(du -h dist/gaia-story-skill.zip | cut -f1))"
echo "Install: unzip gaia-story-skill.zip -d ~/.claude/skills/"
