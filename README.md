# AI-Proof Career OS

Local cohort-learning prototype built from the curriculum in `/Users/mk/Downloads/L1 — TRANSFORMATION_ AI-Proof Career OS — 8-Week Technical Cohort.docx`.

## Stack

- React + Vite
- Static React app for GitHub Pages deployment
- Browser localStorage for demo persistence on Pages
- Tailwind CSS
- Zustand
- Recharts

## What's Included

- Role-based local login for `facilitator` and `student`
- 8-week curriculum engine seeded from the source document
- Facilitator dashboard with:
  - week controls
  - live teaching mode
  - start Session A / B
  - trigger cohort activity
  - recent submissions feed
  - top performer flag
- Student dashboard with:
  - week navigation
  - progress tracking
  - week-specific interactive worksheets and labs
  - submission history
- Polling-based real-time simulation every 5 seconds
- Week 8 PDF export

## Setup

From the project root:

```bash
npm install
npm run dev --workspace client
```

App URLs:

- Frontend: `http://localhost:5173`

## Project Structure

```text
ai-proof-career/
  client/      # React + Vite app for local and GitHub Pages hosting
  server/      # Original local Node prototype backend, not used by Pages
  shared/      # reserved for future shared contracts/assets
```

## Notes

- The curriculum content is structured from the attached DOCX and seeded into the app's browser-side demo store.
- For GitHub Pages, the app now runs fully statically and stores demo data in browser `localStorage`.
- The Colab experience is embedded as an external launcher link, with no backend code execution.
- Authentication is intentionally local and lightweight for prototype use.
- GitHub Pages cannot host the Express backend, so facilitator/student syncing on Pages is per browser storage rather than truly shared across devices.

## GitHub Pages Deployment

The app is automatically deployed to GitHub Pages whenever code is pushed to the `main` branch.

**Live site:** https://manishkumarai.github.io/ai-proof-career/

### How It Works

1. GitHub Actions workflow triggers on push to `main` ([.github/workflows/deploy-pages.yml](.github/workflows/deploy-pages.yml))
2. Workflow installs dependencies and builds the React app
3. Build output is deployed to GitHub Pages
4. Vite is configured with relative asset paths (`base: "./"`) for proper GitHub Pages hosting

### Configuration Details

- **Build output directory:** `client/dist/`
- **Base path:** Relative paths using `./` (configured in `client/vite.config.ts`)
- **Routing:** 404.html redirect enables SPA routing on GitHub Pages
- **Storage:** Application state persists in browser `localStorage`

The build artifacts are automatically generated on each deployment—they should not be committed to git.
