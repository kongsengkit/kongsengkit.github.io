# Kong Seng Kit — Portfolio

Personal portfolio site for Kong Seng Kit — SEO & Content, AI Content Systems.

**Live site:** https://kongsengkit.github.io

## What's inside

- **Results** — an interactive chart of the APAC regional Academy's organic search performance (weekly averages of daily Google Search Console data from BigQuery, Mar–Oct 2026), with metric toggles, crosshair tooltips and keyboard navigation.
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
