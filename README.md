# Vivek Krishnakumar — Personal Website

Personal portfolio hosted at [vivekkrish.com](https://vivekkrish.com), built as a dependency-free static SPA with automated Google Scholar citation syncing via GitHub Actions.

---

## Stack

| Layer | Technology |
|---|---|
| Structure | HTML5 (single-page, hash-routed) |
| Styling | Vanilla CSS3 (custom properties, responsive grid, dark/light theme) |
| Logic | Vanilla JavaScript ES6 (no frameworks) |
| Publications | [BibBase](https://bibbase.org) (Google Scholar feed, embedded dynamically) |
| Citation Stats | Google Scholar (scraped daily by GHA → stored in `scholar_stats.json`) |
| Hosting | GitHub Pages (auto-deploy on push to `master`) |
| Automation | GitHub Actions (daily Scholar sync cron) |

---

## File Structure

```
vivekkrish.github.io/
├── index.html                        # SPA shell: all views (Home, About, Publications, CV)
├── config.json                       # Site config: bio, social handles, orcid
├── scholar_stats.json                # Google Scholar citation stats & history (auto-updated)
├── publications.json                 # List of publications (auto-updated)
├── CNAME                             # Custom domain (vivekkrish.com)
├── keybase.txt                       # Keybase identity proof
├── LICENSE
├── assets/
│   ├── css/style.css                 # Design system, grid layouts, dark/light theme, print overrides
│   ├── js/app.js                     # Hash router, DNA canvas, Scholar chart, accordion logic, theme engine
│   └── images/profile.jpg            # Profile photo
└── scripts/
    └── update_scholar.py             # Scholar scraper: updates scholar_stats.json and publications.json
└── .github/
    └── workflows/
        └── update_scholar.yml        # GHA workflow: daily cron to run update_scholar.py and commit results
```

---

## Configuration (`config.json`)

Edit this file to update site content without touching any HTML or JS:

```json
{
  "name": "Vivek Krishnakumar",
  "title": "Associate Director of Bioinformatics",
  "bio": "...",
  "scholar": "cLlRcPYAAAAJ",
  "orcid": "0000-0002-5227-0200",
  "email": "hello@vivekkrish.com",
  "socials": {
    "github": "vivekkrish",
    "linkedin": "vivekkrish",
    "speakerdeck": "vivekkrish",
    "scholar": "cLlRcPYAAAAJ",
    "instagram": "vivekkrish",
    "twitter": "vivekkrish"
  },
  "socialLinksOrder": ["github", "linkedin", "speakerdeck", "scholar", "instagram", "twitter", "email"]
}
```

| Key | Purpose |
|---|---|
| `scholar` | Google Scholar profile ID — used by BibBase to load your bibliography and by the scraper to fetch stats |
| `orcid` | ORCID profile ID (for record-keeping/reference) |
| `socialLinksOrder` | Controls which icons appear on the homepage and in what order |

> **Note:** `mendeleyToken` fields are no longer used. Publications are sourced exclusively from Google Scholar via BibBase, and citation stats are scraped directly from the Scholar profile page and stored in `scholar_stats.json`.

---

## Google Scholar Automation

Citation stats, the annual citation chart, and the publication bibliography list are kept up-to-date automatically — no manual edits needed.

### How it works

1. **`scripts/update_scholar.py`** — Reads the `scholar` ID from `config.json`, scrapes your Google Scholar profile page (`scholar.google.com/citations?user=<id>`), and extracts:
   - Total citations, h-index, i10-index, and paper count (written to `scholar_stats.json`)
   - Per-year citation history (written to `scholar_stats.json`)
   - Scraped publications metadata list (written to `publications.json`)

2. **`.github/workflows/update_scholar.yml`** — A GitHub Actions workflow that:
   - Runs on a **daily cron schedule** (8:00 UTC)
   - Can also be triggered manually via `workflow_dispatch`
   - Checks out the repo, runs the scraper script, and commits/pushes updates to `scholar_stats.json` and `publications.json` back to `master`

### Running the scraper manually

No external packages are required (uses Python's standard `urllib` and `re` libraries):

```bash
python scripts/update_scholar.py
```

---

## Local Development

The site fetches `config.json` at runtime, so it must be served through a local HTTP server (browsers block `file://` cross-origin reads).

```bash
# Python (built-in)
python -m http.server 8000

# Node.js
npx http-server -p 8000
```

Then open `http://localhost:8000`.

---

## Deployment

GitHub Pages automatically serves the `master` branch root. Push any changes to deploy:

```bash
git add .
git commit -m "Your message"
git push origin master
```

The live site at `vivekkrish.com` will update within ~30 seconds.
