# ScoutVision — Missing Features & Known Issues

> Audit berdasarkan PRD.md (F-01 s.d. F-08) dan DESIGN.md v1.0

---

## 🔴 P0 — Critical / Must Have

### Issue #1: Season selector is cosmetic only — does not fetch real data
**PRD Ref:** F-02 (Acceptance Criteria #3), F-03 (Acceptance Criteria #4)
**DESIGN Ref:** 4.3 Row 2 — Season Selector

**Current:** SeasonSelector component renders pill buttons (`2024/25`, `2023/24`, `2022/23`) but clicking them only updates local React state. No API call is made to fetch statistics for the selected season.

**Expected:** Toggle season must call Sportmonks API with `&filters=playerStatisticSeasons:{season_id}` and re-render all stat components (KPI cells, radar chart, stats table) with the new season's data.

**Files to modify:**
- `src/app/players/[id]/page.tsx` — wire `selectedSeason` to actual data fetch
- `src/components/ui/SeasonSelector.tsx` — pass `season_id` values, not just display labels
- `src/lib/sportmonks-client.ts` — add season filter parameter

**Acceptance Criteria:**
- [ ] Selecting a different season re-fetches player statistics from Sportmonks
- [ ] KPI values update with animation (counter resets to 0 and counts up)
- [ ] Radar chart re-renders with new season data
- [ ] Stats table switches to the selected season's category tabs
- [ ] Loading skeleton appears while fetching new season data
- [ ] Compare page season selector also applies globally to all compared players

---

### Issue #2: Shortlist lacks tag system
**PRD Ref:** F-04 (Acceptance Criteria #3)
**DESIGN Ref:** 4.6 Shortlist Page

**Current:** Players can be added to shortlists, but there is no tagging system.

**Expected:** Each player in a shortlist can be tagged with custom labels (e.g., "priority", "backup", "monitored"). Tags should be visible as colored badges in the shortlist grid view.

**Files to modify:**
- `src/lib/shortlist-store.ts` — add `tags: string[]` to `ShortlistItem`
- `src/components/shortlist/ShortlistCard.tsx` — render tag badges on player avatars
- `src/components/shortlist/ShortlistButton.tsx` — dropdown should allow tag selection

**Acceptance Criteria:**
- [ ] Tag a player when adding to shortlist (dropdown with preset tags + custom input)
- [ ] Tags display as small colored badges on player cards in shortlist view
- [ ] Filter shortlist view by tag
- [ ] Tags persist in localStorage

---

## 🟡 P1 — Should Have

### Issue #3: Export scouting report as PDF (F-08)
**PRD Ref:** F-08 — Export & Reporting
**DESIGN Ref:** 5.6 Shortlist Button, 8. User Journeys

**Current:** No export functionality exists anywhere in the app.

**Expected:** Generate a professional PDF scouting report containing:
- Player photo, bio, current team
- Season statistics (all 60+ stats categorized)
- Radar chart snapshot
- Transfer history timeline
- Shortlist summary (if exporting from shortlist page)

**Suggested library:** `jspdf` + `html2canvas` for chart screenshots

**Files to create/modify:**
- `src/lib/pdf-export.ts` — new PDF generation utility
- `src/components/ui/ExportButton.tsx` — new component
- `src/app/players/[id]/page.tsx` — add Export button to hero card
- `src/app/shortlists/page.tsx` — add Export button per shortlist

**Acceptance Criteria:**
- [ ] "Export as PDF" button visible on player profile hero card
- [ ] PDF contains player photo, bio, stats table, radar chart, transfer history
- [ ] PDF uses A4 portrait layout, print-ready
- [ ] Shortlist page has "Export Shortlist" button generating multi-player report
- [ ] Optional: brand logo upload field (stored in localStorage for v1)

---

### Issue #4: Save & share filter presets in Scout Query Builder (F-05)
**PRD Ref:** F-05 (Acceptance Criteria #3, #4)
**DESIGN Ref:** 4.7 Scout Query Builder

**Current:** Query builder form exists but cannot save presets or share URLs.

**Expected:**
- "Save this search" button stores current filter configuration as a named preset
- Share filter as URL (e.g., `/scout-builder?position=defender&age_min=20&age_max=25&...`)
- Preset list visible below the form for quick re-run

**Files to modify:**
- `src/app/scout-builder/page.tsx` — add save/share UI, read URL params on mount
- `src/lib/query-store.ts` — new Zustand store for saved queries (localStorage)

**Acceptance Criteria:**
- [ ] "Save this search" button creates a named preset
- [ ] Presets list renders below the builder form
- [ ] Clicking a preset pre-fills all form fields
- [ ] URL query params reflect current filter state (shareable link)
- [ ] Visiting a shared URL auto-fills and runs the query

---

### Issue #5: Shortlist view lacks player stat previews
**PRD Ref:** F-04 (Acceptance Criteria #4)
**DESIGN Ref:** 4.6 Shortlist Page — "grid pemain dengan statistik ringkas"

**Current:** Shortlist page shows only player names (or placeholder) in cards. No stats.

**Expected:** Each shortlist card should display a mini grid of players with their key stats (Goals, Assists, Rating) similar to the search result PlayerCard.

**Files to modify:**
- `src/app/shortlists/page.tsx` — fetch player data for each shortlist member
- `src/components/shortlist/ShortlistCard.tsx` — render mini stat grid

**Acceptance Criteria:**
- [ ] Each player in a shortlist shows avatar + name + position + current team
- [ ] Mini stat grid visible: Goals, Assists, Rating (from latest season)
- [ ] Clicking a player navigates to their profile page

---

### Issue #6: Search filters not persisted in URL
**PRD Ref:** F-01 (Acceptance Criteria #5)

**Current:** Only the `query` parameter is stored in URL. Position, age range, league selections are lost on page refresh.

**Expected:** All active filters should be URL-synced: `?query=Salah&position=attacker&age_min=20&age_max=25&league=Premier+League`

**Files to modify:**
- `src/app/players/page.tsx` — sync all filter state to URL via `router.push` with `shallow: true`
- On mount, read URL params and pre-populate filter state

**Acceptance Criteria:**
- [ ] Changing any filter updates the URL without full page reload
- [ ] Copy-pasting a URL restores the exact filter state
- [ ] "Clear All" button resets URL to base `/players`

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
