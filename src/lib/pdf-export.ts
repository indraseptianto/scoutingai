import type { Shortlist } from "@/lib/shortlist-store";
import type { ComparePlayer } from "@/lib/compare-store";

type ReportPlayer = {
  id: number;
  display_name: string;
  common_name?: string;
  image_path?: string;
  date_of_birth?: string;
  height?: number;
  weight?: number;
  preferred_foot?: string;
  position?: { name: string; code?: string };
  detailed_position?: { name: string };
  nationality?: { name: string };
  teams?: { name: string }[];
  statistics?: { stat_type_id: number; value: number }[];
  transfers?: { id: number; date: string; from_team?: { name: string }; to_team?: { name: string } }[];
  selectedSeason?: string;
};

function escapeHtml(value: unknown) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function openPrintReport(title: string, body: string) {
  const printWindow = window.open("", "_blank", "noopener,noreferrer,width=900,height=1200");
  if (!printWindow) return;

  printWindow.document.write(`<!doctype html>
    <html>
      <head>
        <title>${escapeHtml(title)}</title>
        <style>
          @page { size: A4; margin: 18mm; }
          * { box-sizing: border-box; }
          body { font-family: Inter, Arial, sans-serif; color: #111827; margin: 0; }
          .header { border-bottom: 2px solid #0F766E; padding-bottom: 16px; margin-bottom: 22px; }
          .eyebrow { color: #0F766E; font-size: 11px; font-weight: 800; letter-spacing: .14em; text-transform: uppercase; }
          h1 { margin: 6px 0 4px; font-size: 30px; }
          h2 { margin: 24px 0 10px; font-size: 16px; color: #0F766E; }
          .muted { color: #6B7280; font-size: 12px; }
          .grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; }
          .card { border: 1px solid #E5E7EB; border-radius: 14px; padding: 12px; background: #F9FAFB; }
          .label { color: #6B7280; font-size: 10px; text-transform: uppercase; letter-spacing: .08em; }
          .value { margin-top: 4px; font-size: 16px; font-weight: 800; }
          table { width: 100%; border-collapse: collapse; margin-top: 10px; }
          th, td { border-bottom: 1px solid #E5E7EB; padding: 9px; text-align: left; font-size: 12px; }
          th { color: #374151; background: #F3F4F6; }
          .player { display: flex; gap: 16px; align-items: center; }
          .avatar { width: 88px; height: 88px; border-radius: 18px; object-fit: cover; background: #E5E7EB; }
          .tag { display: inline-block; padding: 3px 8px; border-radius: 999px; background: #DBEAFE; color: #1D4ED8; font-size: 10px; font-weight: 700; margin-right: 4px; }
          .footer { margin-top: 28px; color: #9CA3AF; font-size: 10px; }
        </style>
      </head>
      <body>${body}</body>
    </html>`);
  printWindow.document.close();
  printWindow.focus();
  setTimeout(() => printWindow.print(), 250);
}

export function exportPlayerReport(player: ReportPlayer) {
  const name = player.display_name || player.common_name || `Player #${player.id}`;
  const team = player.teams?.[0]?.name || "Unattached / Unknown";
  const position = player.detailed_position?.name || player.position?.name || "Unknown";
  const keyStats = [
    ["Goals", 52],
    ["Assists", 79],
    ["Rating", 118],
    ["Pass Accuracy %", 82],
    ["Minutes", 119],
    ["Appearances", 321],
    ["Tackles", 78],
    ["Interceptions", 100],
    ["Expected Goals", 5304],
  ].map(([label, id]) => {
    const stat = player.statistics?.find((item) => item.stat_type_id === id);
    return `<tr><th>${escapeHtml(label)}</th><td>${escapeHtml(stat?.value ?? "Not available")}</td></tr>`;
  }).join("");
  const transfers = (player.transfers || [])
    .slice()
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 8)
    .map((transfer) => `<tr><td>${escapeHtml(transfer.date || "-")}</td><td>${escapeHtml(transfer.from_team?.name || "-")}</td><td>${escapeHtml(transfer.to_team?.name || "-")}</td></tr>`)
    .join("");
  const logo = typeof window !== "undefined" ? window.localStorage.getItem("scoutvision-report-logo") : null;
  const body = `
    <section class="header">
      ${logo ? `<img src="${escapeHtml(logo)}" alt="Brand logo" style="max-height:42px;margin-bottom:10px" />` : ""}
      <div class="eyebrow">ScoutVision Scouting Report</div>
      <h1>${escapeHtml(name)}</h1>
      <div class="muted">Season ${escapeHtml(player.selectedSeason || "Current")} · Generated ${new Date().toLocaleDateString()} · Player ID ${escapeHtml(player.id)}</div>
    </section>
    <section class="player">
      <img class="avatar" src="${escapeHtml(player.image_path || "/placeholder.svg")}" alt="${escapeHtml(name)}" />
      <div>
        <h2 style="margin-top:0">Profile</h2>
        <div class="muted">${escapeHtml(position)} · ${escapeHtml(team)} · ${escapeHtml(player.nationality?.name || "Unknown nationality")}</div>
      </div>
    </section>
    <h2>Bio Snapshot</h2>
    <div class="grid">
      <div class="card"><div class="label">Date of Birth</div><div class="value">${escapeHtml(player.date_of_birth || "-")}</div></div>
      <div class="card"><div class="label">Physical</div><div class="value">${escapeHtml(player.height || "-")}cm / ${escapeHtml(player.weight || "-")}kg</div></div>
      <div class="card"><div class="label">Preferred Foot</div><div class="value">${escapeHtml(player.preferred_foot || "-")}</div></div>
    </div>
    <h2>Scout Notes</h2>
    <table><tbody>
      <tr><th>Current Team</th><td>${escapeHtml(team)}</td></tr>
      <tr><th>Primary Position</th><td>${escapeHtml(position)}</td></tr>
      <tr><th>Report Link</th><td>${escapeHtml(window.location.href)}</td></tr>
    </tbody></table>
    <h2>Season Statistics</h2>
    <table><tbody>${keyStats}</tbody></table>
    <h2>Radar Snapshot</h2>
    <p class="muted">Radar visual is represented by the key season statistics above for print portability.</p>
    <h2>Transfer History</h2>
    <table>
      <thead><tr><th>Date</th><th>From</th><th>To</th></tr></thead>
      <tbody>${transfers || `<tr><td colspan="3">No transfer history available.</td></tr>`}</tbody>
    </table>
    <div class="footer">Use browser Save as PDF to download this print-ready report.</div>`;
  openPrintReport(`${name} scouting report`, body);
}

export function exportShortlistReport(shortlist: Shortlist) {
  const rows = shortlist.players.map((player) => `
    <tr>
      <td>${escapeHtml(player.playerName || `Player #${player.playerId}`)}</td>
      <td>${escapeHtml(player.playerPosition || "-")}</td>
      <td>${escapeHtml(player.playerTeam || "-")}</td>
      <td>${player.tags.map((tag) => `<span class="tag">${escapeHtml(tag)}</span>`).join("") || "-"}</td>
    </tr>`).join("");

  const body = `
    <section class="header">
      <div class="eyebrow">ScoutVision Shortlist Report</div>
      <h1>${escapeHtml(shortlist.name)}</h1>
      <div class="muted">${escapeHtml(shortlist.priority)} priority · ${shortlist.players.length} players · Generated ${new Date().toLocaleDateString()}</div>
    </section>
    <h2>Shortlist Players</h2>
    <table>
      <thead><tr><th>Player</th><th>Position</th><th>Team</th><th>Tags</th></tr></thead>
      <tbody>${rows || `<tr><td colspan="4">No players in this shortlist.</td></tr>`}</tbody>
    </table>
    <div class="footer">Use browser Save as PDF to download this print-ready report.</div>`;
  openPrintReport(`${shortlist.name} shortlist report`, body);
}

export function exportCompareReport(
  players: ComparePlayer[],
  stats: { label: string; statIds: number[] }[],
  season: string
) {
  const getStat = (player: ComparePlayer, statIds: number[]) => {
    const stat = player.statistics.find((item) => statIds.includes(item.stat_type_id));
    return stat?.value ?? "-";
  };
  const headerCells = players.map((player) => `<th>${escapeHtml(player.display_name)}</th>`).join("");
  const rows = stats.map((stat) => {
    const values = players.map((player) => getStat(player, stat.statIds));
    const numericValues = values.filter((value): value is number => typeof value === "number");
    const max = Math.max(...numericValues, 0);
    return `<tr><th>${escapeHtml(stat.label)}</th>${values.map((value) => {
      const winner = typeof value === "number" && value === max && max > 0;
      return `<td style="${winner ? "color:#16A34A;font-weight:800;background:#F0FFF4;" : ""}">${escapeHtml(value)}</td>`;
    }).join("")}</tr>`;
  }).join("");

  const body = `
    <section class="header">
      <div class="eyebrow">ScoutVision Compare Report</div>
      <h1>Player Comparison</h1>
      <div class="muted">Season ${escapeHtml(season)} · ${players.length} players · Generated ${new Date().toLocaleDateString()}</div>
    </section>
    <h2>Compared Players</h2>
    <table>
      <thead><tr><th>Stat</th>${headerCells}</tr></thead>
      <tbody>${rows || `<tr><td colspan="${players.length + 1}">No players selected.</td></tr>`}</tbody>
    </table>
    <div class="footer">Green cells mark the highest value in each row. Use browser Save as PDF to download this print-ready report.</div>`;
  openPrintReport("ScoutVision compare report", body);
}
