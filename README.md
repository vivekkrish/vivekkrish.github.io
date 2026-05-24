# Vivek Krishnakumar - Personal Website (Revamped)

This is the repository for my personal website hosted at [vivekkrish.com](https://vivekkrish.com). 

The site has been revamped from an outdated Jekyll theme into a high-performance, modern, and dependency-free static site utilizing clean **HTML5**, **CSS3 (with variables and responsive grids)**, and client-side **JavaScript (ES6)**.

## Advantages of the New Stack
*   **Zero Dependencies**: No Ruby, Bundler, or Node dependencies to break or go obsolete over time.
*   **Dynamic Data Syncing**: Your h-index, i10-index, total publications, and a custom SVG citation graph are fetched and rendered **live in the browser** directly from the free [OpenAlex API](https://openalex.org) using your ORCID.
*   **Configuration-Driven**: Update your bio, email, social links, or order of icons easily by editing `config.json` in the root folder.
*   **Print-Optimized CV**: Recruits or site visitors can print/save a clean, perfectly structured PDF of your CV directly from the browser print dialog.

---

## File Structure
```
vivekkrish.github.io/
├── index.html          # Main HTML structure, views, and navigation shell
├── CNAME               # Custom domain config (vivekkrish.com)
├── config.json         # Configuration file for bio, titles, and social handles
├── keybase.txt         # Keybase proof verification
├── LICENSE             # License file
└── assets/
    ├── css/
    │   └── style.css   # Modern layouts, dark/light themes, print overrides, BibBase overrides
    ├── js/
    │   └── app.js      # Router, canvas DNA wave background, OpenAlex chart builder, theme engine
    └── images/
        └── profile.jpg # Profile photo
```

---

## Configuration (`config.json`)

To update details on the website, simply edit the `config.json` file in the root directory:

```json
{
  "name": "Vivek Krishnakumar",
  "title": "Associate Director of Bioinformatics",
  "bio": "Bioinformatics leader managing test engineering...",
  "orcid": "0000-0002-5227-0200",
  "mendeleyToken": "5b47cee1-58c2-3ec3-8bcb-6705001c1867",
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

*   **`orcid`**: Used to fetch live metrics (citations, h-index, i10-index, publication count) and render your annual citation graph.
*   **`mendeleyToken`**: Used by BibBase to load your Mendeley library dynamically.
*   **`socialLinksOrder`**: Determines which icons are shown and the exact order they appear on the homepage.

---

## Local Development & Previewing

To preview the website locally, you must run it through a local HTTP server so that the browser can load the `config.json` file correctly (browsers block loading local files via `file://` protocols due to security rules).

### Propose a Local Server:

#### Option 1: Python (Built into Windows/macOS/Linux)
Open a terminal in the project directory and run:
```bash
python -m http.server 8000
```
Then visit: `http://localhost:8000`

#### Option 2: Node.js (via npx)
```bash
npx http-server -p 8000
```
Then visit: `http://localhost:8000`

---

## Deployment

Since the site is hosted on GitHub Pages, deploying changes is as simple as committing and pushing:

```bash
git add .
git commit -m "Revamp site to clean static stack with OpenAlex citation sync"
git push origin main
```
*(Your custom domain `vivekkrish.com` is configured automatically via the `CNAME` file).*
