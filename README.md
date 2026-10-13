# Kong Seng Kit — Portfolio

Personal portfolio site for Kong Seng Kit — SEO & Content, AI Content Systems.

**Live site:** https://kongsengkit.github.io

## What's inside

- **Results** — the growth story: an interactive chart of organic clicks and impressions shown relative to a mid-April baseline (no absolute traffic is published), with the three steps behind the growth.
- **Projects & Systems** — the content SEO operations platform, the AI content production system, and the editorial, optimisation and technical SEO work behind the growth.
- **Experience** — career timeline from mechanical design engineering to content marketing management.
- **Writing samples** — filterable PDF samples across market analysis, trading education, and content production, with a 3-question recommender quiz.

## Stack

Plain HTML, CSS, and vanilla JavaScript — no frameworks, no build step.

```
index.html      Page structure and content
styles.css      All styling (design tokens in :root)
script.js       Chart (data inline), filters, quiz, scroll interactions
assets/         Résumé PDF, writing samples, images
```

## Run locally

Any static server works:

```bash
python -m http.server 8765
# then open http://localhost:8765
```

## Deploy

Hosted on GitHub Pages from this repository (`kongsengkit.github.io`). Pushing to `main` deploys automatically.
