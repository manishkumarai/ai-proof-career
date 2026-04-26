# AI-Proof Career OS

Local cohort-learning prototype built from the curriculum in `/Users/mk/Downloads/L1 — TRANSFORMATION_ AI-Proof Career OS — 8-Week Technical Cohort.docx`.

## Stack

- React + Vite
- Static React app for GitHub Pages deployment
- Browser localStorage for demo persistence on Pages
- Tailwind CSS
- Zustand
- Recharts

## What’s Included

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
ai-career1/
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

## GitHub Pages

Repository target: `ai-proof-career1`

1. Create a new GitHub repository named `ai-proof-career1`.
2. Push this project so the app files live at the repository root.
3. In GitHub, open `Settings -> Pages` and set `Source` to `GitHub Actions`.
4. Push to `main`.
5. The workflow in [.github/workflows/deploy-pages.yml](/Users/mk/Documents/Codex/ai-career1/.github/workflows/deploy-pages.yml) will publish the site.

The Vite base path is already configured for the GitHub Pages repo path `/ai-proof-career1/`.
