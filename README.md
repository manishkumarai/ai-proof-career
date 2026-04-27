# AI-Proof Career OS

Local cohort-learning prototype built from the curriculum in `/Users/mk/Downloads/L1 — TRANSFORMATION_ AI-Proof Career OS — 8-Week Technical Cohort.docx`.

## Stack

- React + Vite
- Vercel for frontend hosting
- Supabase for shared multi-user data
- Tailwind CSS
- Zustand
- Recharts

## What's Included

- Role-based local login for `facilitator` and `student`
- 8-week curriculum engine with structured weekly worksheets
- Student dashboard with:
<<<<<<< HEAD
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
=======
  - week navigation
  - progress tracking
  - week-specific interactive worksheets and labs
  - submission history
- Polling-based real-time simulation every 5 seconds
- Week 8 PDF export
- Shared facilitator/student state across browsers through Supabase
>>>>>>> b47ffcd4 (build old)

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
<<<<<<< HEAD
ai-proof-career/
  client/      # React + Vite app for GitHub Pages hosting
  server/      # Local Node prototype (not deployed to Pages)
  shared/      # Reserved for future shared contracts/assets
=======
ai-career1/
  client/      # React + Vite app for local and Vercel hosting
  server/      # original local Node prototype backend
  shared/      # reserved for future shared contracts/assets
  supabase/    # schema and setup SQL for hosted data
>>>>>>> b47ffcd4 (build old)
```

## Notes

<<<<<<< HEAD
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
=======
- The curriculum content is structured from the attached DOCX and remains embedded in the client app.
- Shared cohort data now comes from Supabase when environment variables are configured.
- If Supabase env vars are missing, the app falls back to the local browser demo store.
- The Colab experience is embedded as an external launcher link, with no backend code execution.
- Authentication is intentionally local and lightweight for prototype use.

## Supabase Setup

1. Create a new Supabase project.
2. In the Supabase SQL Editor, run [schema.sql](/Users/mk/Documents/Codex/ai-career1/supabase/schema.sql).
3. Copy the project URL and anon public key.
4. Add them to [client/.env.example](/Users/mk/Documents/Codex/ai-career1/client/.env.example) values locally as:

```bash
VITE_SUPABASE_URL=...
VITE_SUPABASE_ANON_KEY=...
```

5. Start the app locally:

```bash
npm install
npm run dev --workspace client
```

On first login, the app will seed the demo cohort into Supabase automatically.

## Vercel Deployment

1. Import the repository into Vercel.
2. Keep the project root at the repository root so [vercel.json](/Users/mk/Documents/Codex/ai-career1/vercel.json) is used.
3. In Vercel Project Settings -> Environment Variables, add:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
4. Redeploy.

Vercel will use:
- `buildCommand`: `npm run build --workspace client`
- `outputDirectory`: `client/dist`

## Security Note

This prototype intentionally keeps the original “simple local role selection” model and uses public Supabase access policies so facilitator/student collaboration works without auth. For a production-ready cohort platform, we should add real Supabase Auth and tighten row-level policies.
>>>>>>> b47ffcd4 (build old)
