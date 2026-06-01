# ScoutVision — Football Player Scouting Platform

ScoutVision is a Next.js scouting dashboard for searching, evaluating, comparing, shortlisting, and exporting football player reports using Sportmonks Football API v3.

**Stack:** Next.js 16 App Router, React 19, TypeScript, Tailwind CSS, Recharts, Zustand, Bento Grid layout.

## Features

- Player Search & Discovery with autocomplete, URL-synced filters, server-side filter application, and true infinite scroll.
- Player Profile pages with hero bio, season switcher, KPI cells, 60+ categorized stats, radar chart, transfer history, trophies, and shortlist actions.
- Position-Based Radar Charts using benchmark-capped percentile-style scoring per position instead of max-relative normalization.
- Player Comparison for up to 4 players with global season refetch, winner highlighting, and print-ready PDF export.
- Shortlists / Watchlists with localStorage persistence, custom tags, tag filtering, player stat previews, and shortlist PDF export.
- Scout Query Builder with grouped filters, stat thresholds, named saved presets, shareable URLs, and server-side filtered results.
- PDF Reporting for player, shortlist, and comparison reports. Player reports include bio, active season stats, transfer history, report link, and optional brand logo upload.
- Real-Time Update Monitor for shortlist players with initial check, 2-hour polling, persistent update log, and notification badge.
- Manual theme control with Light, Dark, and System modes persisted in localStorage.
- Responsive UI with Bento layout, desktop sidebar filters, and mobile filter bottom sheet.

## Data Quality Notes

- Sportmonks availability depends on the API plan and the leagues/seasons enabled for your token.
- Search and Query Builder filters are applied by the ScoutVision API proxy. Where Sportmonks does not expose a direct filter for a UI field, ScoutVision applies server-side filtering to the returned page of data.
- Radar scores use position-specific benchmark caps as a percentile-style approximation. They are not official league percentile rankings unless benchmark datasets are later connected.
- Missing or unavailable stats render as `—` with tooltip messaging where applicable.
- Shortlists, presets, theme preference, uploaded report logo, and update logs are stored locally in the browser for v1.

## Supported League Presets

- La Liga
- Premier League
- Championship
- League One
- League Two

## Getting Started

### Prerequisites

- Node.js 18+
- Sportmonks API token

### Local Development

```bash
git clone https://github.com/indraseptianto/scoutingai.git
cd scoutingai
npm install
cp .env.example .env.local
npm run dev
```

Set your API token in `.env.local`:

```bash
SPORTMONKS_API_TOKEN=your_token_here
```

Open `http://localhost:3000`.

## Verification

```bash
npm run lint
npm run build
```

## Deploy On Vercel

1. Import `indraseptianto/scoutingai` at `vercel.com/new`.
2. Keep default Next.js settings.
3. Add `SPORTMONKS_API_TOKEN` in Project Settings → Environment Variables.
4. Deploy.

`.env.local` is gitignored. Never commit API tokens.

## API Proxy

All Sportmonks API requests go through Next.js API routes:

```text
Client → /api/players/* → Sportmonks API v3
```

This hides the API token from the browser and enables server-side caching/filtering.

## Project Structure

```text
src/
├── app/                # Next.js App Router pages and API routes
├── components/
│   ├── bento/         # BentoGrid and BentoCell layout engine
│   ├── player/        # Player cards, hero, KPI cells, stats table, radar chart
│   ├── shortlist/     # Shortlist controls
│   └── ui/            # Shared UI: theme, tags, season selector, skeletons
├── lib/               # Zustand stores, filters, export helpers, stat/radar config
└── styles/            # Design tokens, Bento CSS, animations
```

## Current Limitations

- No backend user accounts; persistence is browser-local.
- Server-side filtering operates on the current API page unless deeper Sportmonks filters are available.
- Brand logo upload is local to the browser and used only for generated reports.
- Export uses browser print/save-as-PDF for portability without a server PDF renderer.

## License

MIT
