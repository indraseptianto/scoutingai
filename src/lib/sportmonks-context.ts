type PlayerRecord = Record<string, unknown>;

function getTeamIds(player: PlayerRecord) {
  const teams = Array.isArray(player.teams) ? player.teams : [];
  return teams
    .map((team) => {
      if (!team || typeof team !== "object") return null;
      const record = team as Record<string, unknown>;
      return Number(record.id || record.team_id);
    })
    .filter((id): id is number => typeof id === "number" && Number.isFinite(id) && id > 0);
}

async function fetchLeagueNamesForTeam(baseUrl: string, token: string, teamId: number) {
  const url = new URL(`${baseUrl}/leagues/teams/${teamId}/current`);
  url.searchParams.set("api_token", token);
  const res = await fetch(url.toString(), { next: { revalidate: 86400 } });
  if (!res.ok) return [];
  const data = await res.json();
  const leagues: unknown[] = Array.isArray(data.data) ? data.data : [];
  return leagues
    .map((league: unknown) => String((league as Record<string, unknown>).name || ""))
    .filter((name) => Boolean(name));
}

export async function enrichPlayersWithLeagueNames(baseUrl: string, token: string, players: PlayerRecord[]) {
  const teamIds = Array.from(new Set(players.flatMap(getTeamIds))).slice(0, 30);
  if (!teamIds.length) return players;

  const pairs = await Promise.all(
    teamIds.map(async (teamId) => [teamId, await fetchLeagueNamesForTeam(baseUrl, token, teamId)] as const)
  );
  const leagueByTeam = new Map(pairs);

  return players.map((player) => {
    const leagueNames = getTeamIds(player).flatMap((teamId) => leagueByTeam.get(teamId) || []);
    return { ...player, _leagueNames: Array.from(new Set(leagueNames)) };
  });
}
