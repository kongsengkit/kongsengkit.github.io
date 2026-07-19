# Kong Seng Kit — Portfolio

Personal portfolio site for Kong Seng Kit — SEO & Content, AI Content Systems for Financial Markets.

**Live site:** https://kongsengkit.github.io

## What's inside

- **Results** — an interactive chart of 30 months of organic search growth (indexed Google Search Console data), with metric toggles, crosshair tooltips, keyboard navigation, and an accessible data-table view.
- **Projects & Systems** — the AI content production platform, BigQuery content optimisation pipeline, and content programmes behind the growth.
- **Experience** — career timeline from mechanical design engineering to content marketing management.
- **Writing samples** — filterable PDF samples across market analysis, trading education, and content production, with a 3-question recommender quiz.

## Stack

Plain HTML, CSS, and vanilla JavaScript — no frameworks, no build step.

```
index.html      Page structure and content
styles.css      All styling (design tokens in :root)
script.js       Chart, filters, quiz, scroll interactions
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
