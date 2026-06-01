export interface PlayerProfile {
  id: number;
  common_name: string;
  firstname: string;
  lastname: string;
  display_name: string;
  image_path: string;
  date_of_birth: string;
  height: number;
  weight: number;
  gender: string;
  position: {
    id: number;
    name: string;
    code: string;
  };
  detailed_position: {
    id: number;
    name: string;
    code: string;
  };
  preferred_foot: "left" | "right" | "both";
  nationality_id: number;
  country_id: number;
  nationality: {
    id: number;
    name: string;
    image_path: string;
  };
  teams: Team[];
  transfers: Transfer[];
  pendingTransfers: Transfer[];
  statistics: PlayerStatistic[];
  trophies: Trophy[];
  metadata: {
    preferred_foot: string;
  };
}

export interface Team {
  id: number;
  name: string;
  short_code: string;
  image_path: string;
  league_id: number;
  league?: League;
}

export interface League {
  id: number;
  name: string;
  season_id: number;
}

export interface Transfer {
  id: number;
  player_id: number;
  from_team_id: number;
  to_team_id: number;
  from_team: Team;
  to_team: Team;
  date: string;
  type: string;
}

export interface PlayerStatistic {
  id: number;
  player_id: number;
  season_id: number;
  season: {
    id: number;
    name: string;
  };
  position_id: number;
  stat_type_id: number;
  stat_type: {
    id: number;
    name: string;
    developer_name: string;
  };
  value: number;
}

export interface Trophy {
  id: number;
  name: string;
  league: string;
  season: string;
  player_id: number;
}

export interface PlayerSearchResult {
  id: number;
  common_name: string;
  display_name: string;
  image_path: string;
  position: {
    id: number;
    name: string;
    code: string;
  };
  detailed_position: {
    id: number;
    name: string;
  };
  nationality: {
    id: number;
    name: string;
    image_path: string;
  };
  teams: Team[];
  date_of_birth: string;
}

export interface Fixture {
  id: number;
  name: string;
  starting_at: string;
  result_info: string;
  home_team: Team;
  away_team: Team;
  player_statistics?: {
    rating?: number;
  }[];
}
