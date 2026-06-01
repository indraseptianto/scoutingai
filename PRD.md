# PRD — ScoutVision
## Football Player Scouting Platform powered by Sportmonks API v3

**Version:** 1.0  
**Date:** Juni 2026  
**Status:** Draft  
**Owner:** Product Team

---

## 1. Executive Summary

ScoutVision adalah aplikasi scouting pemain sepak bola berbasis data yang memanfaatkan Sportmonks Football API v3 sebagai sumber data utama. Platform ini dirancang untuk membantu scout profesional, direktur sepak bola, pelatih kepala, dan analis pertandingan dalam mengidentifikasi, mengevaluasi, dan membandingkan pemain di lebih dari 2.300 liga di seluruh dunia — secara real-time maupun historis.

Dengan lebih dari 60+ tipe statistik per pemain yang tersedia di API Sportmonks, ScoutVision mengubah raw data menjadi insight yang actionable melalui antarmuka Bento Layout yang modern, intuitif, dan scannable.

---

## 2. Problem Statement

### Masalah Utama

| # | Masalah | Dampak |
|---|---------|--------|
| 1 | Scout masih mengandalkan catatan manual atau spreadsheet Excel | Lambat, rawan error, sulit dibagikan |
| 2 | Data statistik pemain tersebar di banyak sumber berbeda | Inefisiensi waktu, data tidak konsisten |
| 3 | Tidak ada cara mudah membandingkan pemain lintas liga/musim | Keputusan transfer berdasarkan opini, bukan data |
| 4 | Tidak ada watchlist terpusat untuk pemain target | Laporan hilang, kehilangan momentum transfer window |
| 5 | Visualisasi data terlalu teknis atau terlalu sederhana | Scout non-teknis kesulitan menginterpretasi data |

---

## 3. Goals & Non-Goals

### Goals

- Menyediakan profil lengkap pemain berdasarkan data Sportmonks API v3 (endpoint `/v3/football/players/{id}`)
- Menampilkan 60+ statistik per pemain (goals, assists, passes, dribbles, duels, rating, xG, dll.)
- Memungkinkan perbandingan side-by-side hingga 4 pemain sekaligus
- Menyediakan fitur shortlist/watchlist dengan tag dan kategori kustom
- Mendukung filter pencarian berdasarkan posisi, usia, kebangsaan, liga, musim, dan metrik statistik
- Menampilkan riwayat transfer dan tim saat ini via `transfers` include
- Berjalan di web (desktop-first) dengan desain Bento Layout yang responsif

### Non-Goals (v1.0)

- Integrasi video analisis atau highlights
- Fungsi prediksi nilai pasar (dapat dipertimbangkan v2)
- Fitur in-app messaging atau kolaborasi real-time antar pengguna
- Mobile app native (iOS/Android) — cukup mobile responsive
- Data odds atau prediksi pertandingan

---

## 4. Target Users

**Primary Users:**
- Scout Profesional & Direktur Sepak Bola
- Analis Data Sepak Bola

**Secondary Users:**
- Pelatih Kepala
- Agen Pemain
- Jurnalis Olahraga

---

## 5. Sportmonks API v3 Data Mapping

### 5.1 Endpoint Utama

```
GET /v3/football/players                          → Browse semua pemain
GET /v3/football/players/{id}                     → Profil detail pemain
GET /v3/football/players/search/{query}           → Pencarian by nama
GET /v3/football/players/country/{country_id}     → Filter by kebangsaan
GET /v3/football/players/latest                   → Pemain dengan update terbaru
```

### 5.2 Include Strategy

```
?include=metadata;position;detailedPosition;statistics;statistics.details;
         transfers;pendingTransfers;teams;trophies;nationality;lineups
```

**Filter statistik per musim:**
```
&filters=playerStatisticSeasons:{season_id}
```

### 5.3 Player Profile Data Model

```typescript
interface PlayerProfile {
  id: number
  common_name: string
  firstname: string
  lastname: string
  display_name: string
  image_path: string         // CDN Sportmonks
  date_of_birth: string      // ISO 8601
  height: number             // cm
  weight: number             // kg
  gender: string

  position: {
    id: number
    name: string             // "Defender", "Midfielder", etc.
    code: string             // "defender"
  }
  detailed_position: {
    id: number
    name: string             // "Right Back", "Central Midfielder", etc.
    code: string
  }

  preferred_foot: "left" | "right" | "both"

  nationality_id: number
  country_id: number
  teams: Team[]
  transfers: Transfer[]
  pendingTransfers: Transfer[]
}
```

### 5.4 Statistik Pemain yang Ditampilkan

#### 🎯 Attacking
| Stat ID | Nama | Developer Name |
|---------|------|----------------|
| 52 | Goals | `GOALS` |
| 79 | Assists | `ASSISTS` |
| 86 | Shots on Target | `SHOTS_ON_TARGET` |
| 41 | Shots Off Target | `SHOTS_OFF_TARGET` |
| 42 | Shots Total | `SHOTS_TOTAL` |
| 64 | Hit Woodwork | `HIT_WOODWORK` |
| 580 | Big Chances Created | `BIG_CHANCES_CREATED` |
| 581 | Big Chances Missed | `BIG_CHANCES_MISSED` |
| 5304 | Expected Goals (xG) | `EXPECTED_GOALS` |
| 27259 | Hattricks | `HATTRICKS` |
| 47 | Penalties | `PENALTIES` |

#### 🎭 Creativity & Passing
| Stat ID | Nama | Developer Name |
|---------|------|----------------|
| 80 | Passes | `PASSES` |
| 81 | Successful Passes | `SUCCESSFUL_PASSES` |
| 82 | Pass Accuracy % | `SUCCESSFUL_PASSES_PERCENTAGE` |
| 116 | Accurate Passes | `ACCURATE_PASSES` |
| 1584 | Accurate Passes % | `ACCURATE_PASSES_PERCENTAGE` |
| 117 | Key Passes | `KEY_PASSES` |
| 98 | Total Crosses | `TOTAL_CROSSES` |
| 99 | Accurate Crosses | `ACCURATE_CROSSES` |
| 122 | Long Balls | `LONG_BALLS` |
| 123 | Long Balls Won | `LONG_BALLS_WON` |
| 124 | Through Balls | `THROUGH_BALLS` |
| 125 | Through Balls Won | `THROUGH_BALLS_WON` |

#### 🛡️ Defending
| Stat ID | Nama | Developer Name |
|---------|------|----------------|
| 78 | Tackles | `TACKLES` |
| 100 | Interceptions | `INTERCEPTIONS` |
| 101 | Clearances | `CLEARANCES` |
| 97 | Blocked Shots | `BLOCKED_SHOTS` |
| 107 | Aerials Won | `AERIALS_WON` |
| 571 | Error Lead to Goal | `ERROR_LEAD_TO_GOAL` |
| 27255 | Crosses Blocked | `CROSSES_BLOCKED` |

#### ⚡ Duels & Dribbling
| Stat ID | Nama | Developer Name |
|---------|------|----------------|
| 105 | Total Duels | `TOTAL_DUELS` |
| 106 | Duels Won | `DUELS_WON` |
| 108 | Dribble Attempts | `DRIBBLE_ATTEMPTS` |
| 109 | Successful Dribbles | `SUCCESSFUL_DRIBBLES` |
| 110 | Dribbled Past | `DRIBBLED_PAST` |
| 94 | Dispossessed | `DISPOSSESSED` |
| 96 | Fouls Drawn | `PLAYER_FOULS_DRAWN` |

#### 🟨 Discipline
| Stat ID | Nama | Developer Name |
|---------|------|----------------|
| 84 | Yellow Cards | `YELLOWCARDS` |
| 85 | Yellow-Red Cards | `YELLOWRED_CARDS` |
| 83 | Red Cards | `REDCARDS` |
| 56 | Fouls | `FOULS` |
| 87 | Injuries | `INJURIES` |
| 51 | Offsides | `OFFSIDES` |

#### 🧤 Goalkeeper (kondisional)
| Stat ID | Nama | Developer Name |
|---------|------|----------------|
| 57 | Saves | `SAVES` |
| 104 | Saves Inside Box | `SAVES_INSIDE_BOX` |
| 88 | Goals Conceded | `GOALS_CONCEDED` |
| 194 | Clean Sheets | `CLEANSHEET` |

#### 📊 Participation
| Stat ID | Nama | Developer Name |
|---------|------|----------------|
| 321 | Appearances | `APPEARANCES` |
| 119 | Minutes Played | `MINUTES_PLAYED` |
| 322 | Lineups (Started) | `LINEUPS` |
| 323 | Bench | `BENCH` |
| 118 | Rating | `RATING` |
| 214 | Team Wins | `WIN` |
| 215 | Team Draws | `DRAW` |
| 216 | Team Losses | `LOST` |
| 9676 | Avg Points/Game | `AVERAGE_POINTS_PER_GAME` |

---

## 6. Feature Requirements

### F-01 · Player Search & Discovery

**Priority:** P0 — Must Have

**Endpoint:** `GET /v3/football/players/search/{query}`

**Acceptance Criteria:**
- [ ] Pencarian nama menghasilkan hasil dalam <500ms (autocomplete)
- [ ] Filter dapat dikombinasikan (contoh: midfielder + usia <25 + liga Eropa)
- [ ] Hasil menampilkan foto, nama, posisi, tim saat ini, dan kebangsaan
- [ ] Pagination 20 pemain per halaman dengan infinite scroll
- [ ] Filter tersimpan di URL untuk shareable link

### F-02 · Player Profile Page

**Priority:** P0 — Must Have

**Endpoint:** `GET /v3/football/players/{id}?include=metadata;position;detailedPosition;statistics.details.type;transfers;teams;trophies`

**Acceptance Criteria:**
- [ ] Semua 60+ statistik ditampilkan dengan kategorisasi yang tepat
- [ ] Radar chart otomatis menyesuaikan metrik berdasarkan posisi pemain
- [ ] Toggle musim (season_id) mengupdate semua statistik secara real-time
- [ ] Tombol "Add to Shortlist" tersedia di hero card
- [ ] URL dapat dibagikan dan menghasilkan halaman yang sama

### F-03 · Player Comparison

**Priority:** P1 — Should Have

**Acceptance Criteria:**
- [ ] Pengguna dapat mencari dan menambahkan pemain ke comparison panel
- [ ] Setiap kolom mewakili satu pemain (max 4)
- [ ] Baris mewakili statistik; sel berwarna hijau untuk nilai tertinggi di tiap baris
- [ ] Filter musim berlaku global untuk semua pemain yang dibandingkan
- [ ] Export hasil perbandingan sebagai PDF atau gambar PNG

### F-04 · Shortlist / Watchlist

**Priority:** P1 — Should Have

**Storage:** Lokal (localStorage) di v1

**Acceptance Criteria:**
- [ ] Buat shortlist baru dengan nama kustom
- [ ] Tambahkan pemain ke shortlist mana pun dari halaman profil atau hasil pencarian
- [ ] Tandai pemain dengan tag kustom (contoh: "priority", "backup", "monitored")
- [ ] View shortlist menampilkan grid pemain dengan statistik ringkas
- [ ] Export shortlist sebagai PDF laporan scouting

### F-05 · Advanced Filter & Scout Query Builder

**Priority:** P1 — Should Have

**Acceptance Criteria:**
- [ ] Filter disusun dalam grup logis (Identity, Position, Stats Range)
- [ ] Preview jumlah hasil update real-time saat filter diubah
- [ ] Save filter preset dengan nama kustom
- [ ] Share filter sebagai URL

### F-06 · Position-Based Radar Chart

**Priority:** P1 — Should Have

**Acceptance Criteria:**
- [ ] Chart menggunakan skala persentil (bukan nilai absolut)
- [ ] Pengguna dapat overlay dua pemain dalam satu radar chart
- [ ] Animasi masuk saat data loaded

### F-07 · Real-Time Update Monitor

**Priority:** P2 — Nice to Have

**Endpoint:** `GET /v3/football/players/latest` (polling setiap 2 jam)

**Acceptance Criteria:**
- [ ] Badge notifikasi muncul di ikon shortlist saat ada update
- [ ] Log update menampilkan perubahan

### F-08 · Export & Reporting

**Priority:** P2 — Nice to Have

**Acceptance Criteria:**
- [ ] Template laporan berisi: foto pemain, bio, statistik musim ini, radar chart, riwayat transfer
- [ ] Brand logo klub/organisasi dapat diupload dan muncul di header laporan
- [ ] Format A4 portrait, siap cetak

---

## 7. Technical Architecture

### 7.1 Stack Rekomendasi

```
Frontend:     Next.js 15 (App Router) + TypeScript
Styling:      Tailwind CSS + CSS Grid (Bento Layout)
Charts:       Recharts / D3.js untuk radar & bar charts
State:        Zustand (shortlist, filter state)
API Layer:    Next.js API Routes sebagai proxy (menyembunyikan API token)
Cache:        Redis atau Vercel KV (cache response Sportmonks 30 menit)
Auth:         NextAuth.js (Google OAuth) — untuk shortlist persistence di v2
```

### 7.2 API Proxy Pattern

```
Client → Next.js API Route → Sportmonks API v3
                          ↑
                     Cache Layer (Redis)
```

**Cache Strategy:**
- Player profile: TTL 30 menit
- Statistics: TTL 1 jam
- Search results: TTL 5 menit
- Latest updated players: TTL 2 jam

---

## 8. User Journeys

### Journey 1: Scout Mencari Target Transfer

```
[Search] → Ketik "Salah" → Autocomplete → Pilih "Mohamed Salah"
         ↓
[Profile] → Lihat statistik musim ini → Bandingkan dengan musim lalu
          ↓
[Compare] → Tambahkan Sane ke comparison → Lihat perbedaan side-by-side
          ↓
[Shortlist] → Tambahkan Salah ke "Targets Summer 2026" → Tag "priority"
            ↓
[Export] → Generate PDF laporan → Kirim ke direktur
```

### Journey 2: Analisis Pemain Muda

```
[Filter Builder] → Posisi: Winger | Usia: 16-21 | Liga: Top 5 Eropa
                → Rating > 7.0 | Appearances > 10 | Dribbles > 2/game
                ↓
[Results] → 23 pemain ditemukan → Sort by xG
          ↓
[Profile] → Buka Lamine Yamal → Lihat progress per musim
          ↓
[Shortlist] → Tambahkan ke "Youth Prospects" → Tag "monitor"
```

---

## 9. KPIs & Success Metrics

| Metrik | Target (6 bulan) |
|--------|------------------|
| Waktu mencari pemain spesifik | < 30 detik |
| Waktu load profil pemain | < 2 detik |
| Pengguna aktif mingguan | 500+ |
| Shortlist dibuat per pengguna | ≥ 3 |
| Laporan PDF digenerate | > 200/bulan |
| Bounce rate halaman profil | < 30% |
| NPS Score | ≥ 50 |

---

## 10. Milestones & Roadmap

### Phase 1 — MVP (Minggu 1–6)
- [ ] Setup Next.js + Tailwind + Sportmonks proxy
- [ ] Player Search (F-01)
- [ ] Player Profile Page (F-02) dengan top 20 statistik
- [ ] Bento Layout design system

### Phase 2 — Core Features (Minggu 7–12)
- [ ] Full statistik 60+ (F-02 lengkap)
- [ ] Player Comparison (F-03)
- [ ] Shortlist (F-04) — localStorage
- [ ] Radar Chart (F-06)

### Phase 3 — Power Features (Minggu 13–20)
- [ ] Scout Query Builder (F-05)
- [ ] Real-time Monitor (F-07)
- [ ] Export PDF (F-08)
- [ ] User auth + sync shortlist ke backend

### Phase 4 — Growth (Bulan 6+)
- [ ] API publik untuk integrasi pihak ketiga
- [ ] Mobile PWA
- [ ] Video highlights integration
- [ ] ML-based player recommendation engine

---

## 11. Risks & Mitigations

| Risiko | Probabilitas | Dampak | Mitigasi |
|--------|-------------|--------|----------|
| Rate limit Sportmonks API terlampaui | Medium | High | Aggressive caching, request batching |
| Data historis tidak lengkap | High | Medium | Tampilkan pesan "data not available" gracefully |
| API downtime Sportmonks | Low | High | Fallback ke cache terakhir, status indicator |
| Biaya API mahal untuk skala besar | Medium | Medium | Monitor usage, upgrade plan bertahap |
| Pemain tidak ditemukan di API | Medium | Low | Link ke pencarian Sportmonks langsung |

---

## 12. Open Questions

1. Apakah v1 membutuhkan autentikasi pengguna, atau cukup anonymous dengan localStorage?
2. Budget Sportmonks API plan mana yang digunakan?
3. Apakah perlu multi-bahasa (EN/ID) sejak v1?
4. Apakah ada data pemain wanita yang perlu didukung?
5. Apakah ada kebutuhan white-label untuk dijual ke klub?

---

*ScoutVision PRD v1.0 — Dibuat berdasarkan Sportmonks API v3 Documentation*
