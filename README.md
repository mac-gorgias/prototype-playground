# ◈ Prototype Playground

A lightweight, self-hosted prototype gallery for the design team. Publish HTML prototypes from Claude Code (or anywhere) and share them with a link.

**Live dashboard:** `https://YOUR_USERNAME.github.io/prototype-playground`

---

## Quick Start

### 1. Create the GitHub repo

Go to [github.com/new](https://github.com/new) and create a new **public** repo called `prototype-playground`.

```bash
# Clone it locally
git clone https://github.com/YOUR_USERNAME/prototype-playground.git
cd prototype-playground
```

### 2. Copy these files in

Copy all the files from this package into your repo:

```
prototype-playground/
├── index.html          ← The dashboard
├── viewer.html         ← Wraps each prototype with a "Back" button
├── prototypes.json     ← Manifest (tracks all prototypes)
├── publish.md          ← Claude Code slash command for publishing
├── prototypes/         ← Each prototype lives in its own subfolder
│   ├── my-prototype/
│   │   └── index.html
│   └── .gitkeep
├── images/             ← Preview images (one per prototype, named by slug)
└── README.md
```

### 3. Enable GitHub Pages

1. Push your code: `git add -A && git commit -m "init" && git push`
2. Go to your repo on GitHub → **Settings** → **Pages**
3. Under "Source", select **Deploy from a branch**
4. Choose `main` branch, `/ (root)` folder
5. Click **Save**

Your dashboard will be live at `https://YOUR_USERNAME.github.io/prototype-playground` within a minute.

---

## Publishing a Prototype

Publishing is handled by the `/publish` slash command in [Claude Code](https://claude.com/claude-code). The command is defined in `publish.md` at the repo root.

In a Claude Code session, just say something like:

```
/publish ~/Downloads/onboarding.html as "AI Agent Onboarding V2"
```

Claude will:
- Generate a slug from the name (e.g. `ai-agent-onboarding-v2`)
- Create `prototypes/<slug>/index.html` with your HTML file
- Copy a preview image into `images/<slug>.png` (if you provide one)
- Append an entry to `prototypes.json`
- Commit and push to GitHub
- Share the viewer link

### Screenshots

If you don't explicitly pass a screenshot, Claude will offer to use the most recent one from your Desktop (`~/Desktop/Screenshot*.png`). You can also say:

```
/publish ~/Downloads/sms.html as "SMS Builder" with my latest screenshot
```

### Updating an existing prototype

```
/publish the new version of "AI Agent Onboarding V2" from ~/Downloads/onboarding-v3.html
```

Claude matches by slug, replaces the file (and/or image), and pushes the update.

---

## For Teammates (Viewing Only)

Just share the dashboard link. No GitHub account needed to view prototypes.

**Dashboard:** `https://YOUR_USERNAME.github.io/prototype-playground`

Each prototype also has a direct link like:
`https://YOUR_USERNAME.github.io/prototype-playground/viewer.html?file=my-prototype/index.html`

---

## For Teammates (Publishing)

If other designers want to publish too:

1. **Install Git** — Download from [git-scm.com](https://git-scm.com/) or run `xcode-select --install` on Mac
2. **Install [Claude Code](https://claude.com/claude-code)**
3. **Get repo access** — Ask the repo owner to add you as a collaborator
4. **Clone the repo:**
   ```bash
   git clone https://github.com/YOUR_USERNAME/prototype-playground.git
   ```
5. **Open the repo in Claude Code and run `/publish`** with your HTML file.

---

## Troubleshooting

**Merge conflicts on prototypes.json**
→ The publish flow does `git pull --rebase` before pushing. If there's a conflict, run `git pull` manually, resolve conflicts in `prototypes.json`, then push again.

**Changes not showing on the live site**
→ GitHub Pages can take 1–2 minutes to deploy. Check the Actions tab on your repo for deploy status.

**Dashboard card has a broken image**
→ Make sure the image exists at `images/<slug>.png` (or whatever extension is in the manifest). The `image` field in `prototypes.json` is the filename only — no folder prefix.

**Prototype 404s inside the viewer**
→ Confirm the `file` field in `prototypes.json` is `<slug>/index.html` and that the file actually exists at `prototypes/<slug>/index.html`.

---

## How It Works

The system is intentionally simple — no build step, no backend, no database.

- `index.html` is a static page that fetches `prototypes.json` at load time and renders the gallery
- `viewer.html` is a thin wrapper that iframes a prototype and adds a "Back to projects" button
- `prototypes.json` is the single source of truth for all prototype metadata
- `publish.md` is a Claude Code slash command that automates slug generation, file copying, manifest updates, and git operations
- GitHub Pages serves everything as static files for free

Future ideas:
- Slack integration to auto-post new prototype links
- Thumbnail screenshots via Puppeteer
- Password protection via Cloudflare Access
- Drag-and-drop web uploader (no terminal needed)
