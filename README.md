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
- 8-week curriculum engine with structured weekly worksheets
- Student dashboard with:
  - Week navigation
  - Progress tracking (completion %)
  - Week-specific interactive worksheets and labs
  - Submission history
  - PDF export (Week 8)
- Facilitator demo mode with:
  - Practice presentation mode on YOUR device
  - Demo session starting (local to device only)
  - Local activity triggering (not broadcast to students)
  - Demo data reset

## How It Works

**Student Experience (All Devices):**
- Each student works independently through 8 weeks
- All progress saved locally in browser storage
- Works completely offline
- No server required

**Facilitator Experience (Demo Mode):**
- Practice presenting with curriculum content
- Try presentation mode on your local device
- For actual live teaching: use screen-sharing via Zoom, Teams, or Meet
- All facilitator features are demo/practice only
- Cannot broadcast to students without backend

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
  client/      # React + Vite app for GitHub Pages hosting
  server/      # Local Node prototype (not deployed to Pages)
  shared/      # Reserved for future shared contracts/assets
```

## Notes

- The curriculum content is structured from the attached DOCX and built into the app
- For GitHub Pages, the app runs fully statically with no backend
- All student and facilitator data is stored in browser `localStorage`
- Facilitator "demo mode" features are practice-only—for live cohort experiences, use screen-sharing
- Authentication is intentionally local and lightweight for prototype use
- Each device maintains its own independent data (no cross-device sync)

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

## Limitations

**Single-Device Operation:**
- This is a **static web app** with no backend
- Student data is private to each device
- Facilitator features are demo/practice only
- Live cohort sync requires screen-sharing (Zoom, Teams, Meet)

**Not Available on GitHub Pages:**
- Multi-device facilitator dashboards
- Real-time student rankings
- Cohort-wide submission aggregation
- Live activity broadcasting to students

**For true cohort collaboration:**
- Deploy a Node.js backend
- Use WebSocket for real-time sync
- Run a database for cross-device state

## Development

To work on the student curriculum:
- Edit worksheet content in `/client/src/components/StudentWeekWorkspace.tsx`
- Modify week definitions in `/client/src/lib/localData.ts`
- All changes auto-deploy to GitHub Pages on push to main

## Contact

Built for the AI-Proof Career OS cohort learning model.
