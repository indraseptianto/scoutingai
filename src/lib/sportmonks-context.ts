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

async function fetchTeam(baseUrl: string, token: string, teamId: number) {
  const url = new URL(`${baseUrl}/teams/${teamId}`);
  url.searchParams.set("api_token", token);
  const res = await fetch(url.toString(), { next: { revalidate: 86400 } });
  if (!res.ok) return null;
  const data = await res.json();
  const team = data.data as Record<string, unknown> | undefined;
  if (!team) return null;
  return {
    id: Number(team.id || teamId),
    name: String(team.name || ""),
    image_path: String(team.image_path || ""),
  };
}

export async function enrichPlayerTeamNames(baseUrl: string, token: string, player: PlayerRecord) {
  const teams = Array.isArray(player.teams) ? player.teams : [];
  const missingNameTeams = teams.filter((team) => {
    if (!team || typeof team !== "object") return false;
    const record = team as Record<string, unknown>;
    return !record.name && Number(record.id || record.team_id) > 0;
  });
  if (!missingNameTeams.length) return player;

  const hydrated = await Promise.all(
    teams.map(async (team) => {
      if (!team || typeof team !== "object") return team;
      const record = team as Record<string, unknown>;
      if (record.name) return record;
      const teamId = Number(record.id || record.team_id);
      if (!Number.isFinite(teamId) || teamId <= 0) return record;
      const detail = await fetchTeam(baseUrl, token, teamId);
      return detail ? { ...record, ...detail } : record;
    })
  );

  return { ...player, teams: hydrated };
}
