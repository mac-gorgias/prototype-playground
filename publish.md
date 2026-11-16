# Publish Prototype to Playground

You are helping a designer publish an HTML prototype to the Prototype Playground.

## What the user will provide

1. **The HTML file path** — where the prototype file is on their computer, or a folder that already lives in `prototypes/<slug>/` (e.g. one scaffolded by the `gaia-story` skill)
2. **The prototype name** — a short, descriptive name
3. **A screenshot** (optional) — a preview image for the dashboard card

If they don't provide a description, generate a brief one based on the prototype name.

## Finding a screenshot automatically

If the user doesn't explicitly provide a screenshot, **ask if they want to include one**. If they say yes, find the most recent screenshot on their Desktop:

```bash
ls -t ~/Desktop/Screenshot*.png 2>/dev/null | head -1
```

Show them the filename and ask if that's the right one before using it.

If the user says something like "use the latest screenshot" or "grab my screenshot", find it automatically using the command above.

## Playground location

Work from the user's own clone of the repo — never assume a fixed path. Find the root with:

```bash
REPO="$(git rev-parse --show-toplevel)"   # run from inside the clone
```

- Prototypes folder: `$REPO/prototypes/`
- Images folder: `$REPO/images/`
- Manifest: `$REPO/prototypes.json`
- Live dashboard: `https://mac-gorgias.github.io/prototype-playground`

If the current directory isn't inside a clone of `mac-gorgias/prototype-playground`, ask where their clone is.
Publishing pushes to the GitHub repo, so the user needs push access (ask Mac to add them as a collaborator).

## Steps to publish

1. **Generate a folder slug** from the prototype name (lowercase, hyphens, no special characters).
   Example: "AI Agent Onboarding V2" → `ai-agent-onboarding-v2`

2. **Create the prototype folder and copy the HTML file** (skip if it's already `$REPO/prototypes/<slug>/index.html`):
```bash
   mkdir -p "$REPO/prototypes/<slug>"
   cp "<SOURCE_FILE>" "$REPO/prototypes/<slug>/index.html"
```
   Gaia Story Kit prototypes load shared files from `gaia-kit/` — make sure any new files they reference
   (`gaia-kit/modules/*`, `gaia-kit/use-cases/*`, `gaia-kit/stories/*`) are committed too.

3. **If a screenshot is provided or found**, copy it to the images folder:
```bash
   cp "<SCREENSHOT_PATH>" "$REPO/images/<slug>.png"
```
   If the source image is .jpg, .jpeg, or .webp, keep that extension instead.

4. **Update prototypes.json** — read the current JSON array, then append a new entry:
```json
   {
     "name": "<PROTOTYPE_NAME>",
     "author": "<AUTHOR — first name from `git config user.name`>",
     "date": "<TODAY YYYY-MM-DD>",
     "description": "<DESCRIPTION>",
     "file": "<slug>/index.html",
     "image": "<slug>.png"
   }
```
   Only include `"image"` if a screenshot was provided.
   Write the updated array back to prototypes.json with proper formatting.

5. **Push to GitHub** (GitHub Pages deploys from `main`):
```bash
   cd "$REPO"
   git pull --rebase
   git add -A
   git commit -m "add: <PROTOTYPE_NAME>"
   git push
```
   If the user is on a feature branch (e.g. a Conductor workspace), push the branch and open a PR to
   `main` instead — the prototype goes live when it's merged.

6. **Share the links**:
   - Prototype: `https://mac-gorgias.github.io/prototype-playground/viewer.html?file=<slug>/index.html`
   - Dashboard: `https://mac-gorgias.github.io/prototype-playground`

## Example prompts the user might say

- "Publish ~/Downloads/onboarding.html as 'AI Agent Onboarding V2'" → ask if they want a screenshot
- "Publish this with my latest screenshot" → find most recent screenshot on Desktop
- "Publish ~/Downloads/sms.html as 'SMS Builder' with screenshot ~/Desktop/Screenshot 2026-03-02.png"
- "Add a screenshot to the existing AI Agent Onboarding V2 prototype" → update image field and copy image

## Updating an existing prototype

If the user wants to update a prototype that already exists:
1. Replace `prototypes/<slug>/index.html` with the new file
2. If a new screenshot is provided, replace `images/<slug>.png`
3. Update the entry in `prototypes.json` (match by slug)
4. Commit and push