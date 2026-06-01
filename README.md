# ScoutVision — Football Player Scouting Platform

> Search, compare, and scout football players across 2,300+ leagues with 60+ statistics powered by [Sportmonks API v3](https://docs.sportmonks.com/).

**Stack:** Next.js 15 + TypeScript + Tailwind CSS + Bento Grid Layout

---

## Features

- **Player Search & Discovery** — Autocomplete search with position, age, league, and stat filters
- **Player Profile Page** — Full profile with hero card, 60+ stats, KPI grid, radar chart, transfer history, trophies
- **Player Comparison** — Side-by-side comparison table for up to 4 players with winner highlighting
- **Shortlists / Watchlist** — Organize tracked players with priority tags (localStorage persistence)
- **Scout Query Builder** — Visual filter builder to find players by stats thresholds
- **Position-Based Radar Charts** — 6-axis radar with metrics tailored to position
- **Real-Time Update Monitor** — Badge notifications when shortlist players get new stats

---

## Getting Started

### Prerequisites

- Node.js 18+
- [Sportmonks API token](https://docs.sportmonks.com/)

### Local Development

```bash
# Clone the repo
git clone https://github.com/indraseptianto/scoutingai.git
cd scoutingai

# Install dependencies
npm install

# Set environment variables
cp .env.example .env.local
# Edit .env.local and add your Sportmonks API token
# SPORTMONKS_API_TOKEN=your_token_here

# Run dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## Deploy on Vercel

The fastest way to deploy:

### Step 1 — Import to Vercel

1. Go to [vercel.com/new](https://vercel.com/new)
2. Import the GitHub repository `indraseptianto/scoutingai`
3. Vercel will auto-detect Next.js — keep the default settings

### Step 2 — Add Environment Variables

In the Vercel dashboard → Project Settings → Environment Variables, add:

| Variable | Value |
|----------|-------|
| `SPORTMONKS_API_TOKEN` | Your Sportmonks API token |

### Step 3 — Deploy

Click **Deploy**. Vercel will build and deploy automatically.

> **Note:** `.env.local` is gitignored. Never commit API tokens.

---

## API Proxy

All Sportmonks API requests are proxied through Next.js API Routes:

```
Client → /api/players/* → Sportmonks API v3
```

This hides the API token from the browser and enables server-side caching.

---

## Project Structure

```
src/
├── app/                # Next.js App Router pages + API routes
├── components/
│   ├── bento/         # BentoGrid, BentoCell layout engine
│   ├── player/        # PlayerCard, HeroCard, KPICell, StatsTable, RadarChart
│   ├── shortlist/     # ShortlistButton, ShortlistCard
│   └── ui/            # PositionBadge, StatTrend, SeasonSelector, Skeleton
├── lib/               # Stores (Zustand), Sportmonks client, stat categories
└── styles/            # Design tokens, Bento CSS, animations
```

---

## License

MIT
