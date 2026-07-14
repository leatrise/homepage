# Leatrise · Tiny Lab

A small, anonymous personal homepage for collecting public projects and current interests without turning the page into a résumé.

## What is on the page

- Android system tinkering, automation, embedded development, bots, games, and creative production
- Links to selected **public** GitHub repositories only
- A compact light/dark theme with responsive mobile layout
- An official GitHub GraphQL contribution calendar, refreshed by GitHub Actions
- No real name, school, age, location, phone number, email address, or analytics tracker

## Customize

The main content lives in:

- `index.html` — copy, links, sections, and project cards
- `static/css/custom.css` — the personal visual layer
- `static/svg/logo.svg` and `static/svg/favicon.svg` — anonymous visual identity
- `static/js/script.js` — theme switching and lightweight interactions
- `scripts/update-contributions.mjs` — GitHub GraphQL contribution data generator
- `.github/workflows/update-contributions.yml` — scheduled and manual data refresh

The original `style.css` and `root.css` are retained so upstream layout updates remain easier to compare.

## Run locally

This is a static site. Open `index.html` directly, or serve the folder with any static web server:

```bash
python -m http.server 8080
```

Then visit `http://localhost:8080`.

## Contribution calendar

The `Update GitHub contributions` workflow runs daily and can also be started manually from the Actions tab. It uses the repository-provided `GITHUB_TOKEN`, requests `leatrise` contribution data from GitHub's official GraphQL API, and updates `static/data/contributions.json` only when the calendar changes.

The workflow requires repository Actions to have write access under **Settings → Actions → General → Workflow permissions**. No personal access token is stored in the frontend.

## Credits

This homepage is based on [ZYYO666/homepage](https://github.com/ZYYO666/homepage).  
The custom content and visual layer in this fork are tailored for the `leatrise` online identity.
