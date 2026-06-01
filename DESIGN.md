# DESIGN.md — ScoutVision
## Design System & UI/UX Specification
### Layout: Bento Grid · Design Skill: `npx typeui.sh pull bento`

**Version:** 1.0  
**Stack:** Next.js 15 + Tailwind CSS + CSS Grid  
**Design Skill:** Bento (typeui.sh)  
**Install:** `npx typeui.sh pull bento`

---

## 1. Design Philosophy

ScoutVision mengadopsi **Bento Design Skill** dari typeui.sh — sistem layout berbasis grid modular yang terinspirasi kotak bento Jepang. Setiap konten menempati "sel" yang jelas batasnya, dengan ukuran bervariasi (1×1, 1×2, 2×1, 2×2), menciptakan hierarki visual yang natural tanpa perlu elemen dekoratif tambahan.

### Prinsip Desain

```
1. GRID IS LAW        — Semua elemen snap ke grid 12-kolom atau sub-grid 4/6/8
2. WARM, NOT STERILE  — Palet peach-cream menghindari dinginnya abu-abu dashboard biasa
3. SELF-CONTAINED     — Setiap bento cell bermakna sendiri tanpa konteks sel tetangga
4. DATA FIRST         — Statistik adalah bintang, desain adalah panggungnya
5. SCANNABLE          — Scout butuh informasi dalam 3 detik, bukan 30 menit
```

---

## 2. Design Tokens

### 2.1 Color Palette (Bento Official)

```css
:root {
  /* Primary — Peach warm (highlighted blocks, accent surfaces) */
  --color-primary:    #FAD4C0;
  --color-primary-dark: #F0A882;   /* hover state */
  --color-primary-text: #7A3B1E;   /* text di atas primary bg */

  /* Secondary — Muted blue (supporting actions) */
  --color-secondary:  #80A1C1;
  --color-secondary-dark: #5A7F9F;

  /* Semantic */
  --color-success:    #16A34A;     /* goal, assist, positive stat */
  --color-warning:    #D97706;     /* yellow card, caution */
  --color-danger:     #DC2626;     /* red card, injury, loss */
  --color-neutral:    #6B7280;     /* draw, neutral info */

  /* Surface */
  --color-surface:    #FFF5E6;     /* background card fill */
  --color-surface-2:  #FFF0D9;     /* nested card, slightly darker */
  --color-bg:         #FDF8F3;     /* page background */

  /* Text */
  --color-text:       #111827;     /* body text */
  --color-text-muted: #6B7280;     /* secondary labels */
  --color-text-dim:   #9CA3AF;     /* placeholder, disabled */

  /* Border */
  --color-border:     #E5D5C3;     /* bento cell borders */
  --color-border-strong: #C9B09A;  /* emphasized borders */

  /* Data Visualization */
  --color-stat-attack:  #EF4444;   /* merah — attacking stats */
  --color-stat-pass:    #3B82F6;   /* biru — passing stats */
  --color-stat-defend:  #10B981;   /* hijau — defensive stats */
  --color-stat-duel:    #8B5CF6;   /* ungu — duel stats */
  --color-stat-gk:      #F59E0B;   /* amber — goalkeeper stats */
}
```

### 2.2 Typography

```css
/* Font Stack */
--font-primary:   'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
--font-mono:      'JetBrains Mono', 'Fira Code', monospace;

/* Type Scale (Bento: 12/14/16/20/24/32px) */
--text-xs:    0.75rem;    /* 12px — compact cell labels, badges */
--text-sm:    0.875rem;   /* 14px — body secondary, table cells */
--text-base:  1rem;       /* 16px — body primary */
--text-lg:    1.25rem;    /* 20px — card titles, section headings */
--text-xl:    1.5rem;     /* 24px — page sub-headings */
--text-2xl:   2rem;       /* 32px — page headings, hero names */
--text-3xl:   2.5rem;     /* 40px — stat big numbers, KPI values */

/* Font Weights */
--weight-light:    300;
--weight-regular:  400;
--weight-medium:   500;
--weight-semibold: 600;
--weight-bold:     700;
--weight-black:    900;
```

### 2.3 Spacing Scale

```css
/* Base unit: 4px */
--space-1:  0.25rem;   /* 4px */
--space-2:  0.5rem;    /* 8px */
--space-3:  0.75rem;   /* 12px */
--space-4:  1rem;      /* 16px — default padding */
--space-6:  1.5rem;    /* 24px — section gap */
--space-8:  2rem;      /* 32px — page margin */
--space-12: 3rem;      /* 48px — hero area */

/* Grid Gap */
--grid-gap:  1rem;     /* 16px between bento cells */
--cell-pad:  1.25rem;  /* 20px internal padding bento cell */
```

### 2.4 Border Radius & Shadow

```css
--radius-sm:   0.375rem;   /* 6px — badges, tags */
--radius-md:   0.75rem;    /* 12px — bento cells */
--radius-lg:   1rem;       /* 16px — modal, drawer */
--radius-full: 9999px;     /* pill badges, avatars */

--shadow-cell: 0 1px 3px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04);
--shadow-hover: 0 4px 12px rgba(0,0,0,0.1);
--shadow-focus: 0 0 0 3px rgba(250, 212, 192, 0.5);  /* peach focus ring */
```

---

## 3. Grid System — The Bento Layout Engine

### 3.1 Grid Foundation

```css
/* Root Bento Grid — 12 kolom */
.bento-grid {
  display: grid;
  grid-template-columns: repeat(12, 1fr);
  gap: var(--grid-gap);
  padding: var(--space-6);
}

/* Cell Size Variants */
.cell-1x1  { grid-column: span 3;  grid-row: span 1; }  /* 1/4 lebar */
.cell-1x2  { grid-column: span 3;  grid-row: span 2; }  /* 1/4 lebar, 2x tinggi */
.cell-2x1  { grid-column: span 6;  grid-row: span 1; }  /* 1/2 lebar */
.cell-2x2  { grid-column: span 6;  grid-row: span 2; }  /* 1/2 lebar, 2x tinggi */
.cell-3x1  { grid-column: span 9;  grid-row: span 1; }  /* 3/4 lebar */
.cell-4x1  { grid-column: span 12; grid-row: span 1; }  /* full lebar */
.cell-4x2  { grid-column: span 12; grid-row: span 2; }  /* full lebar, 2x tinggi */

/* Responsive Collapse */
@media (max-width: 1280px) {
  .bento-grid { grid-template-columns: repeat(8, 1fr); }
}
@media (max-width: 768px) {
  .bento-grid { grid-template-columns: repeat(4, 1fr); }
  [class^="cell-"] { grid-column: span 4; grid-row: span 1; }
}
```

### 3.2 Bento Cell Base Styles

```css
.bento-cell {
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  padding: var(--cell-pad);
  box-shadow: var(--shadow-cell);
  transition: box-shadow 200ms ease, transform 200ms ease;
  overflow: hidden;
}

.bento-cell:hover {
  box-shadow: var(--shadow-hover);
}

/* Cell Variants */
.bento-cell--primary   { background: var(--color-primary);   border-color: var(--color-primary-dark); }
.bento-cell--secondary { background: #E8F0F7;               border-color: var(--color-secondary); }
.bento-cell--dark      { background: #1F2937;               border-color: #374151; color: #F9FAFB; }
.bento-cell--ghost     { background: transparent;           border-style: dashed; }
```

---

## 4. Pages & Screen Designs

### 4.1 Global Navigation

```
┌──────────────────────────────────────────────────────────────┐
│  🔍 ScoutVision     [Search bar — 40% width]    👤  ≡       │
│                                                              │
│  [Players]  [Compare]  [Shortlists]  [Scout Builder]        │
└──────────────────────────────────────────────────────────────┘
```

**Specs:**
- Height: 64px
- BG: `#FFFFFF` dengan `border-bottom: 1px solid var(--color-border)`
- Logo: Inter Bold, 20px, `#111827`
- Search: rounded-full, placeholder "Search players, teams, leagues..."
- Nav links: Inter Medium 14px, active state: underline + `--color-primary-dark`
- Mobile: hamburger collapse ke bottom sheet

### 4.2 Homepage / Dashboard

```
┌──────────────────────────────────────────────────────────────┐
│  [4x1] HERO SEARCH CARD                                      │
│  "Find your next player"  [Search input — large]            │
│  Quick filters: [All Positions ▾] [All Leagues ▾] [Age ▾]  │
├────────────────────────┬─────────────────────────────────────┤
│  [2x2]                 │  [1x1]        │  [1x1]             │
│  Recently Viewed       │  Shortlists   │  Quick Compare     │
│  (player cards grid)   │  3 active     │  2 players         │
├────────────────────────┼───────────────┴────────────────────┤
│  [1x1]    │ [1x1]     │  [2x1]                             │
│  Top      │ Active    │  Recently Updated Players           │
│  Scorers  │ Transfers │  (via /players/latest endpoint)     │
└────────────────────────┴────────────────────────────────────┘
```

### 4.3 Player Profile Page — Full Bento Layout

```
PAGE: /players/[id]
```

#### Row 1 — Hero (Full Width)
```
┌──────────────────────────────────────────────────────────────────┐
│  [2x1] HERO CARD (cell--dark)                                    │
│                                                                  │
│  [120px foto]  James Tavernier          🏴󠁧󠁢󠁥󠁮󠁧󠁿 English              │
│                Right Back · Defender    ⚽ Rangers FC            │
│                #2 · Age 34             📅 DOB: 31 Oct 1991       │
│                ⊕ Add to Shortlist  ↗ Share  ⋯ More              │
│                                                                  │
├──────────────┬───────────────┬──────────────────────────────────┤
│  [1x1]       │  [1x1]        │  [1x1]                           │
│  Physical    │  Preferred    │  Career                          │
│  182cm / 75kg│  ⚽ Right Foot │  Joined: 2015                    │
│              │               │  Value: Est. €4.5M               │
└──────────────┴───────────────┴──────────────────────────────────┘
```

#### Row 3 — KPI Bento Grid (6 KPI Cells + Radar)
```
┌──────────────────────────────────────────────────────────────────┐
│  [1x2] RADAR CHART   │  [1x1] GOALS │  [1x1] ASSISTS           │
│                      │    12  ↑+3   │    8   →0                 │
│   (position-based    │   ──────────  │  ────────────             │
│    6-axis radar)     │   vs pos avg  │   vs pos avg              │
│                      ├──────────────┼───────────────────────────┤
│                      │  [1x1] RATING│  [1x1] PASS ACC%          │
│                      │   7.4  ↑+0.2 │   84%  ↑+2pp              │
│                      ├──────────────┼───────────────────────────┤
│                      │  [1x1] MINS  │  [1x1] APPS               │
│                      │  2,340 ⏱     │   27  🏟️                  │
└──────────────────────┴──────────────┴───────────────────────────┘
```

**KPI Cell Specs:**
```css
.stat-kpi-cell {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.stat-kpi-value {
  font-size: var(--text-3xl);    /* 40px — big number */
  font-weight: var(--weight-black);
  font-variant-numeric: tabular-nums;
  color: var(--color-text);
  line-height: 1;
  font-family: var(--font-mono);
}

.stat-kpi-label {
  font-size: var(--text-xs);
  font-weight: var(--weight-medium);
  color: var(--color-text-muted);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.stat-kpi-trend {
  font-size: var(--text-sm);
  font-weight: var(--weight-semibold);
}
.stat-kpi-trend--up    { color: var(--color-success); }
.stat-kpi-trend--down  { color: var(--color-danger); }
.stat-kpi-trend--flat  { color: var(--color-neutral); }
```

#### Row 4 — Full Statistics (Tabbed)
```
┌──────────────────────────────────────────────────────────────────┐
│  [4x2] STATISTICS DEEP DIVE                                      │
│  [Attacking] [Passing] [Defending] [Duels] [Discipline] [GK]    │
│  ─────────────────────────────────────────────────────────────   │
│  Stat Name           Value    Rank (Liga)    Trend              │
│  Goals               12       3rd            ████████░░ 78%     │
│  Assists             8        5th            ██████░░░░ 61%     │
│  Shots Total         67       4th            ████████░░ 74%     │
│  Shots on Target     31       3rd            ███████░░░ 70%     │
│  xG                  9.8      4th            ███████░░░ 68%     │
│  Hit Woodwork        3        1st            ██████████ 100%    │
│  Big Chances Created 14       2nd            █████████░ 92%     │
│  Big Chances Missed  5        —              ████░░░░░░ 40%     │
│  Hattricks           1        —              ██░░░░░░░░ 20%     │
│  Penalties           2        —              —                  │
└──────────────────────────────────────────────────────────────────┘
```

**Statistics Row Spec:**
```css
.stat-row {
  display: grid;
  grid-template-columns: 2fr 80px 100px 1fr;
  align-items: center;
  padding: 10px 0;
  border-bottom: 1px solid var(--color-border);
  gap: 16px;
}

.stat-bar {
  height: 6px;
  background: var(--color-border);
  border-radius: 9999px;
  overflow: hidden;
}

.stat-bar-fill {
  height: 100%;
  border-radius: 9999px;
  background: var(--color-primary-dark);
  transition: width 600ms cubic-bezier(0.34, 1.56, 0.64, 1);
}

/* Warna bar berdasarkan kategori stat */
.stat-bar-fill--attack  { background: var(--color-stat-attack); }
.stat-bar-fill--pass    { background: var(--color-stat-pass); }
.stat-bar-fill--defend  { background: var(--color-stat-defend); }
.stat-bar-fill--duel    { background: var(--color-stat-duel); }
```

### 4.4 Player Search Page

```
PAGE: /players
```

```
┌──────────────────────────────────────────────────────────────────┐
│  [4x1] SEARCH BAR + ACTIVE FILTERS                              │
│  🔍 "Searching: Winger · U23 · Top 5 Leagues"  [Clear All ×]   │
├──────────────────────────────────────────────────────────────────┤
│  [1x4] FILTER SIDEBAR        │  [3x4] RESULTS GRID             │
│                              │                                  │
│  Position                    │  ┌──────┐ ┌──────┐ ┌──────┐    │
│  ○ GK  ○ DEF  ● MID  ○ ATT   │  │ Card │ │ Card │ │ Card │    │
│                              │  └──────┘ └──────┘ └──────┘    │
│  Detailed Position           │  ┌──────┐ ┌──────┐ ┌──────┐    │
│  ☑ Winger  ☑ Left Wing      │  │ Card │ │ Card │ │ Card │    │
│  ☐ Right Wing               │  └──────┘ └──────┘ └──────┘    │
│                              │                                  │
│  Age Range                   │  Showing 47 players             │
│  [16] ──────●── [30]        │  Sort by: [Rating ▾]            │
│                              │                                  │
│  League                      │  [Load more ↓]                  │
│  ☑ Premier League            │                                  │
│  ☑ La Liga                   │                                  │
│  ☑ Bundesliga                │                                  │
│                              │                                  │
│  Nationality                 │                                  │
│  [All ▾]                    │                                  │
│                              │                                  │
│  Stats Thresholds            │                                  │
│  Min Rating  [7.0] ─────    │                                  │
│  Min Apps    [10]  ─────    │                                  │
│  Min Goals   [0]   ─────    │                                  │
└──────────────────────────────┴──────────────────────────────────┘
```

### 4.5 Player Comparison Page

```
PAGE: /compare
```

```
┌──────────────────────────────────────────────────────────────────┐
│  [4x1] COMPARISON HEADER                                        │
│  "Comparing 2 players"  [+ Add player]  Season: [2024/25 ▾]   │
├──────────────────────────────────────────────────────────────────┤
│       │  [1x1] Player A Hero  │  [1x1] Player B Hero  │ [+]   │
│       │  J. Tavernier         │  T. Alexander-Arnold  │ add   │
│       │  Right Back · Rangers │  Right Back · Real MD │       │
│       │  🏴󠁧󠁢󠁥󠁮󠁧󠁿 Age 34         │  🏴󠁧󠁢󠁥󠁮󠁧󠁿 Age 26         │       │
├───────┼───────────────────────┼───────────────────────┼───────┤
│ Goals │       12 🟢           │       11              │       │
│ Assts │        8              │       15 🟢            │       │
│ Rating│       7.4             │        7.8 🟢          │       │
│ Pass% │       84% 🟢          │       83%              │       │
│ xG    │       9.8             │       10.1 🟢          │       │
│ Tckls │       56 🟢           │       34               │       │
│ Intr. │       42 🟢           │       28               │       │
│ Drbl  │       21              │       38 🟢            │       │
│ YCard │        4              │        2 🟢            │       │
│ Apps  │       27 🟢           │       25               │       │
└───────┴───────────────────────┴───────────────────────┴───────┘
```

### 4.6 Shortlist Page

```
PAGE: /shortlists
```

```
┌──────────────────────────────────────────────────────────────────┐
│  [4x1] SHORTLISTS HEADER                                        │
│  "My Shortlists" (3 active)             [+ New Shortlist]       │
├────────────────────────────────────────────────────────────────┤
│  [1x2] Shortlist Card      │  [1x2] Shortlist Card             │
│  "Targets Summer 2026"     │  "Youth Prospects"                │
│  12 players · High Priority│  8 players · Under 23             │
│  [Tavernier] [Salah] [+9]  │  [Yamal] [Bellingham Jr] [+6]     │
│  [Open →]                  │  [Open →]                         │
├────────────────────────────┼───────────────────────────────────┤
│  [1x2] Shortlist Card      │  [1x1] Quick Add                  │
│  "GK Backup Options"       │  Search & add player to           │
│  4 players · Low priority  │  any shortlist quickly            │
│  [Open →]                  │  [Search player...]               │
└────────────────────────────┴───────────────────────────────────┘
```

### 4.7 Scout Query Builder

```
PAGE: /scout-builder
```

```
┌──────────────────────────────────────────────────────────────────┐
│  [4x1] BUILDER HEADER                                           │
│  "Scout Query Builder"  Build your ideal player profile         │
├──────────────────────────────────────────────────────────────────┤
│  [2x3] QUERY BUILDER FORM         │  [2x3] RESULTS PREVIEW     │
│                                   │                             │
│  Identity                         │  "23 players match         │
│  ○ All   ● Male   ○ Female        │   your criteria"           │
│                                   │                             │
│  Position                         │  [Player Card Mini ×3]     │
│  Defender · Right Back            │                             │
│                                   │  Rating avg: 7.2           │
│  Age Range                        │  Goals avg: 4.1            │
│  [20] ────────●──── [25]          │  Pass % avg: 79%           │
│                                   │                             │
│  League / Season                  │  [View all results →]      │
│  [Premier League ▾]               │                             │
│  [2024/25 ▾]                      │  [Save this search]        │
│                                   │                             │
│  Nationality                      │                             │
│  [All ▾] or [South East Asia]     │                             │
│                                   │                             │
│  Stat Thresholds                  │                             │
│  Goals ≥ [3]  Assists ≥ [2]      │                             │
│  Pass% ≥ [75]  Rating ≥ [7.0]   │                             │
│  Apps ≥ [15]                      │                             │
│  Tackles ≥ [30]                   │                             │
│                                   │                             │
│  [Run Query →]  [Reset All]       │                             │
└───────────────────────────────────┴─────────────────────────────┘
```

---

## 5. Component Library

### 5.1 Position Badge

```jsx
// Usage: <PositionBadge position="Right Back" category="defender" />

const positionColors = {
  goalkeeper: { bg: '#FEF3C7', text: '#92400E', border: '#F59E0B' },
  defender:   { bg: '#DBEAFE', text: '#1E3A8A', border: '#3B82F6' },
  midfielder: { bg: '#D1FAE5', text: '#064E3B', border: '#10B981' },
  attacker:   { bg: '#FEE2E2', text: '#7F1D1D', border: '#EF4444' },
}
```

### 5.2 Stat Trend Badge

```jsx
// ↑+3  ↓-1  →0
<StatTrend value={+3} label="vs last season" />
```

### 5.3 Season Selector

```jsx
<SeasonSelector
  seasons={["2024/25", "2023/24", "2022/23"]}
  current="2024/25"
  onChange={(s) => updateStats(s)}
/>
// Tabs styled as pill buttons, primary fill for active
```

### 5.4 Player Avatar

```jsx
<PlayerAvatar
  src={player.image_path}
  name={player.display_name}
  size={120}           // hero | 64px card | 40px inline
  withFlag={true}
  nationality="English"
/>
```

### 5.5 Radar Chart

```jsx
<RadarChart
  player={player}
  metrics={getMetricsByPosition(player.position)}
  // Returns: 6-axis radar, percentile-scaled
  compareWith={player2}   // optional overlay
  animated={true}
/>
```

### 5.6 Shortlist Button

```jsx
<ShortlistButton
  playerId={player.id}
  // Shows dropdown with existing shortlists
  // Option to create new shortlist
/>

// States:
// Default:   [☆ Add to Shortlist]  — border, bg: transparent
// In list:   [★ In Shortlist]      — primary fill
// Loading:   [⟳ Adding...]         — spinner
```

---

## 6. Motion & Interaction Design

### 6.1 Animation Principles

```css
/* Timing Functions */
--ease-out-expo:  cubic-bezier(0.16, 1, 0.3, 1);     /* snap into place */
--ease-spring:    cubic-bezier(0.34, 1.56, 0.64, 1);  /* slight overshoot */
--ease-smooth:    cubic-bezier(0.4, 0, 0.2, 1);       /* material-like */

/* Durations */
--dur-instant:  100ms;
--dur-fast:     200ms;
--dur-normal:   300ms;
--dur-slow:     600ms;
```

### 6.2 Key Animations

**Page Load — Bento Cells Stagger In:**
```css
@keyframes cellEnter {
  from {
    opacity: 0;
    transform: translateY(12px) scale(0.98);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

.bento-cell:nth-child(n) {
  animation: cellEnter var(--dur-normal) var(--ease-out-expo) forwards;
  animation-delay: calc(n * 60ms);
}
```

**Stat Bar Fill (on scroll into view):**
```css
@keyframes fillBar {
  from { width: 0%; }
  to   { width: var(--fill-percent); }
}
/* Triggered via IntersectionObserver */
```

**Number Counter:**
```js
// Count up from 0 to target value over 800ms
// Used for KPI cells on player profile load
```

### 6.3 Hover States

```
Player Card:    translateY(-2px) + shadow elevation
Bento Cell:     border-color shift + shadow elevation
Stat Row:       bg-color shift ke --color-surface-2
Nav Link:       underline slide in from left (200ms)
Button:         scale(0.98) on press, scale(1.02) on hover
```

---

## 7. Loading & Empty States

### 7.1 Skeleton Loading (Bento Cells)

```jsx
// Setiap bento cell memiliki skeleton versinya
<SkeletonCell size="1x1">
  <div className="skeleton-line w-1/2 h-8 mb-2" />
  <div className="skeleton-line w-full h-4" />
  <div className="skeleton-line w-3/4 h-4 mt-1" />
</SkeletonCell>

// CSS:
.skeleton-line {
  background: linear-gradient(
    90deg,
    var(--color-border) 25%,
    #F0E6D8 50%,
    var(--color-border) 75%
  );
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
  border-radius: var(--radius-sm);
}

@keyframes shimmer {
  from { background-position: 200% 0; }
  to   { background-position: -200% 0; }
}
```

### 7.2 Empty States

```
No Results: 
  Ilustrasi pemain sederhana (SVG) + "No players match your filters"
  CTA: [Clear Filters] atau [Try different position]

Empty Shortlist:
  Icon 📋 + "Your shortlist is empty"
  CTA: [Browse Players]

Stat Not Available:
  Inline: "—" dengan tooltip "Not available for this season"
```

---

## 8. Accessibility

Mengikuti **WCAG 2.2 AA** sesuai standar Bento Design Skill:

```
Contrast Ratios:
  Text (#111827) on Surface (#FFF5E6):    16.5:1  ✅ (required 4.5:1)
  Text (#111827) on Primary (#FAD4C0):    8.2:1   ✅
  Muted (#6B7280) on Surface:            4.7:1   ✅

Keyboard Navigation:
  Tab order mengikuti visual bento grid order (top-left → bottom-right)
  Setiap interactive element: visible focus ring (peach, 3px)
  Escape menutup modal/dropdown
  Arrow keys navigasi dalam tab group

Screen Reader:
  Setiap bento cell: aria-label deskriptif
  Radar chart: aria-describedby dengan text summary data
  Stat bars: aria-valuenow, aria-valuemin, aria-valuemax

Motion:
  prefers-reduced-motion: semua animasi diganti fade sederhana
```

---

## 9. Responsive Breakpoints

```
xs:  < 480px   — Mobile portrait: stack semua cells full-width
sm:  480–768px — Mobile landscape: 2-kolom grid
md:  768–1024px — Tablet: 6-kolom grid, sidebar collapse
lg:  1024–1280px — Desktop: 8-kolom grid
xl:  > 1280px   — Full desktop: 12-kolom grid, semua bento sizes aktif
```

**Mobile Player Profile (xs/sm):**
```
[Hero Card — full width]
[KPI Cards — 2 kolom scroll horizontal]
[Radar Chart — full width]
[Stats Table — full width, tabbed]
[Transfers — full width]
```

---

## 10. Dark Mode (Optional — v2)

```css
@media (prefers-color-scheme: dark) {
  :root {
    --color-bg:      #111827;
    --color-surface: #1F2937;
    --color-surface-2: #374151;
    --color-border:  #374151;
    --color-text:    #F9FAFB;
    --color-text-muted: #9CA3AF;
    
    /* Primary tetap warm, sedikit lebih gelap */
    --color-primary: #D4A88A;
  }
}
```

---

## 11. Design Checklist — Before Ship

```
□ Semua bento cells memiliki min-height yang konsisten
□ Gap antar cells uniform (16px)
□ Semua angka statistik menggunakan font monospace (tabular-nums)
□ Position badge muncul di setiap card yang menampilkan pemain
□ Trend badges menunjukkan perbandingan yang relevan (vs musim sebelumnya)
□ Radar chart hanya tampil dengan data musim yang sama
□ Empty/null stats menampilkan "—" bukan "0" atau "null"
□ Loading state untuk setiap API call
□ Error state jika API gagal (retry button)
□ Mobile scroll berfungsi smooth pada KPI horizontal scroll
□ Semua gambar pemain: fallback ke placeholder jika CDN gagal
□ Focus visible pada semua interactive elements
□ Screen reader test pada player profile page
```

---

## 12. File Structure Rekomendasi

```
src/
├── app/
│   ├── players/
│   │   ├── page.tsx                 # Search & browse
│   │   └── [id]/page.tsx            # Player profile
│   ├── compare/page.tsx             # Comparison
│   ├── shortlists/page.tsx          # Shortlists
│   └── scout-builder/page.tsx       # Query builder
├── components/
│   ├── bento/
│   │   ├── BentoGrid.tsx            # Grid container
│   │   ├── BentoCell.tsx            # Cell wrapper
│   │   └── cell-variants/           # Specific cell types
│   ├── player/
│   │   ├── PlayerHeroCard.tsx
│   │   ├── PlayerKPICell.tsx
│   │   ├── PlayerStatsTable.tsx
│   │   ├── PlayerRadarChart.tsx
│   │   ├── PlayerCard.tsx           # Search result card
│   │   └── PlayerCompareColumn.tsx
│   ├── shortlist/
│   │   ├── ShortlistButton.tsx
│   │   └── ShortlistCard.tsx
│   └── ui/
│       ├── PositionBadge.tsx
│       ├── StatTrendBadge.tsx
│       ├── SeasonSelector.tsx
│       └── SkeletonCell.tsx
├── styles/
│   ├── tokens.css                   # Design tokens (section 2)
│   ├── bento.css                    # Grid system (section 3)
│   └── animations.css               # Motion (section 6)
├── lib/
│   ├── sportmonks.ts                # API client + types
│   ├── stat-categories.ts           # Stat groupings by category
│   └── radar-metrics.ts             # Position-based radar config
└── SKILL.md                         # Bento design skill (via typeui.sh)
```

---

*ScoutVision DESIGN.md v1.0 · Layout: Bento · Install: `npx typeui.sh pull bento`*
