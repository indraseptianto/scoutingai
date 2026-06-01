# ScoutVision — Missing Features & Known Issues

> Audit berdasarkan PRD.md (F-01 s.d. F-08) dan DESIGN.md v1.0

---

## 🔴 P0 — Critical / Must Have

### ✅ Issue #1: Season selector is cosmetic only — does not fetch real data
**PRD Ref:** F-02 (Acceptance Criteria #3), F-03 (Acceptance Criteria #4)
**DESIGN Ref:** 4.3 Row 2 — Season Selector
**Status:** ✅ Fixed in `feat: real season data fetch + shortlist tag system`

**Files modified:**
- `src/lib/seasons.ts` — added season name → Sportmonks season_id mapping
- `src/app/api/players/[id]/route.ts` — added `season` query param with `filters=playerStatisticSeasons:{season_id}`
- `src/app/players/[id]/page.tsx` — rewired `selectedSeason` to actual data fetch via `useCallback`
- `src/components/ui/SeasonSelector.tsx` — added `disabled` prop + loading indicator
- `src/components/ui/SkeletonCell.tsx` — added `4x2` size support

**Acceptance Criteria:**
- [x] Selecting a different season re-fetches player statistics from Sportmonks
- [x] KPI values update with animation (counter resets to 0 and counts up)
- [x] Radar chart re-renders with new season data
- [x] Stats table switches to the selected season's category tabs
- [x] Loading skeleton appears while fetching new season data
- [ ] Compare page season selector also applies globally to all compared players *(deferred to P1)*

---

### ✅ Issue #2: Shortlist lacks tag system
**PRD Ref:** F-04 (Acceptance Criteria #3)
**DESIGN Ref:** 4.6 Shortlist Page
**Status:** ✅ Fixed in `feat: real season data fetch + shortlist tag system`

**Files modified:**
- `src/lib/shortlist-store.ts` — already had `tags: string[]` and `updatePlayerTags`
- `src/components/shortlist/ShortlistButton.tsx` — added dropdown with preset tags (priority/backup/monitored) + custom input
- `src/components/ui/TagBadge.tsx` — new reusable tag badge component
- `src/components/player/PlayerHeroCard.tsx` — passes full player props to `ShortlistButton`
- `src/app/shortlists/page.tsx` — renders `TagBadge` on each player with remove capability

**Acceptance Criteria:**
- [x] Tag a player when adding to shortlist (dropdown with preset tags + custom input)
- [x] Tags display as small colored badges on player cards in shortlist view
- [ ] Filter shortlist view by tag *(deferred to P1 — search/filter infrastructure)*
- [x] Tags persist in localStorage

---

## 🟡 P1 — Should Have

### ✅ Issue #3: Export scouting report as PDF (F-08)
**PRD Ref:** F-08 — Export & Reporting
**DESIGN Ref:** 5.6 Shortlist Button, 8. User Journeys
**Status:** ✅ Fixed in `feat: add P1 scouting workflow features`

**Implemented:** Browser print-ready PDF report generation using `src/lib/pdf-export.ts` with player and shortlist report templates.

**Acceptance Criteria:**
- [x] "Export as PDF" button visible on player profile hero card
- [x] PDF contains player photo, bio, current team and scout notes
- [x] PDF uses A4 portrait layout, print-ready
- [x] Shortlist page has "Export PDF" button generating multi-player report
- [ ] Optional: brand logo upload field (stored in localStorage for v1)

---

### ✅ Issue #4: Save & share filter presets in Scout Query Builder (F-05)
**PRD Ref:** F-05 (Acceptance Criteria #3, #4)
**DESIGN Ref:** 4.7 Scout Query Builder
**Status:** ✅ Fixed in `feat: add P1 scouting workflow features`

**Implemented:** Named presets via Zustand/localStorage, copyable share URLs, and URL-param hydration for Query Builder.

**Acceptance Criteria:**
- [x] "Save this search" button creates a named preset
- [x] Presets list renders below the builder form
- [x] Clicking a preset pre-fills all form fields
- [x] URL query params reflect current filter state (shareable link)
- [x] Visiting a shared URL auto-fills the query

---

### ✅ Issue #5: Shortlist view lacks player stat previews
**PRD Ref:** F-04 (Acceptance Criteria #4)
**DESIGN Ref:** 4.6 Shortlist Page — "grid pemain dengan statistik ringkas"
**Status:** ✅ Fixed in `feat: add P1 scouting workflow features`

**Implemented:** Expanded shortlist player rows now fetch player details and show Goals, Assists, and Rating stat previews.

**Acceptance Criteria:**
- [x] Each player in a shortlist shows avatar + name + position + current team
- [x] Mini stat grid visible: Goals, Assists, Rating (from latest season)
- [x] Clicking a player navigates to their profile page

---

### ✅ Issue #6: Search filters not persisted in URL
**PRD Ref:** F-01 (Acceptance Criteria #5)
**Status:** ✅ Fixed in `feat: add P1 scouting workflow features`

**Implemented:** Search page reads and writes query, position, detailed position, league, age range, and sort state to URL params.

**Acceptance Criteria:**
- [x] Changing any filter updates the URL without full page reload
- [x] Copy-pasting a URL restores the exact filter state
- [x] "Clear All" button resets URL to base `/players`

---

## 🟢 P2 — Nice to Have

### Issue #7: Dark mode toggle
**DESIGN Ref:** Section 10 — Dark Mode

**Current:** Dark mode CSS exists in `tokens.css` via `prefers-color-scheme: dark`, but there is no manual toggle.

**Expected:** Theme toggle button in navigation that switches between light/dark/system, persisted in localStorage.

**Files to modify:**
- `src/app/layout.tsx` — add theme toggle button
- `src/styles/tokens.css` — add `.dark` class selector in addition to media query
- `src/lib/theme-store.ts` — new Zustand store for theme preference

---

### Issue #8: True infinite scroll on search results
**PRD Ref:** F-01 (Acceptance Criteria #4)

**Current:** "Load more ↓" button at bottom of results.

**Expected:** Auto-load next page when user scrolls to bottom (intersection observer based).

**Files to modify:**
- `src/app/players/page.tsx` — replace button with IntersectionObserver trigger

---

### Issue #9: Stat tooltips for unavailable / null data
**DESIGN Ref:** Section 7.2 — Empty States / Stat Not Available

**Current:** Missing stats show "—" but without tooltip.

**Expected:** Hovering over "—" shows tooltip: "Not available for this season" or "Data not recorded".

**Files to modify:**
- `src/components/player/PlayerStatsTable.tsx` — add tooltip on dash values
- `src/components/player/PlayerKPICell.tsx` — add tooltip when value is 0/missing

---

### Issue #10: Mobile responsive sidebar collapse on search page
**DESIGN Ref:** Section 9 — Responsive Breakpoints

**Current:** Filter sidebar is `hidden lg:block` which completely hides it on mobile. No alternative filter UI.

**Expected:** Mobile should show a floating "Filters" button that opens a bottom sheet or drawer with all filters.

**Files to modify:**
- `src/app/players/page.tsx` — add mobile filter drawer toggle

---

## ✅ Already Implemented (Verified)

| Feature | Status | Evidence |
|---------|--------|----------|
| F-01 Player Search + Autocomplete | ✅ | `SearchAutocomplete.tsx`, `/api/players/search` |
| F-01 Filter sidebar (position, age, league) | ✅ | `players/page.tsx` sidebar |
| F-01 PlayerCard with photo/stats | ✅ | `PlayerCard.tsx` |
| F-02 Hero Card with bio | ✅ | `PlayerHeroCard.tsx` |
| F-02 60+ stats categorized | ✅ | `STAT_CATEGORIES` in `stat-categories.ts` |
| F-02 Radar chart by position | ✅ | `PlayerRadarChart.tsx`, `radar-metrics.ts` |
| F-02 Transfer history | ✅ | `players/[id]/page.tsx` transfer section |
| F-02 Trophies | ✅ | `players/[id]/page.tsx` trophies section |
| F-03 Compare up to 4 players | ✅ | `compare/page.tsx` table |
| F-03 Green highlight winner | ✅ | `.compare-cell--winner` logic |
| F-04 Create / delete shortlists | ✅ | `shortlist-store.ts`, `shortlists/page.tsx` |
| F-04 Add to shortlist from profile | ✅ | `ShortlistButton.tsx` |
| F-05 Query builder form | ✅ | `scout-builder/page.tsx` |
| F-05 Stat threshold inputs | ✅ | Goals, Assists, Pass%, Rating, Apps, Tackles |
| F-06 Radar percentile scale | ✅ | Normalized to 0-100 in `PlayerRadarChart.tsx` |
| F-06 Radar overlay compare | ✅ | `compareWith` prop on `PlayerRadarChart` |
| F-07 Update Monitor badge | ✅ | `UpdateMonitor.tsx` polling `/players/latest` |
| DESIGN: Bento Grid system | ✅ | `BentoGrid.tsx`, `BentoCell.tsx`, `bento.css` |
| DESIGN: Design tokens | ✅ | `tokens.css` (colors, spacing, shadows, radius) |
| DESIGN: Number counter animation | ✅ | `AnimatedCounter` in `PlayerKPICell.tsx` |
| DESIGN: Skeleton loading | ✅ | `SkeletonCell.tsx`, `shimmer` keyframes |
| DESIGN: Position badges | ✅ | `PositionBadge.tsx` with category colors |
| DESIGN: Stat trend badges | ✅ | `StatTrendBadge.tsx` (↑ ↓ →) |
| DESIGN: 12-column responsive grid | ✅ | `bento.css` with breakpoints |
| DESIGN: Hover / focus states | ✅ | Shadow elevation, border-color shift |
| DESIGN: 404 + loading pages | ✅ | `not-found.tsx`, `loading.tsx` |

---

*Generated: Audit against PRD v1.0 + DESIGN.md v1.0*
