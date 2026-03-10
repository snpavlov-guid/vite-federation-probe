export type LeagueDataStatus = 'idle' | 'loading' | 'succeeded' | 'failed';

export interface TournamentStage {
  id: number;
  name: string;
  order: number;
  leagueId: number;
  tournamentId: number;
  stageType?: string | number | null;
}

export interface LeagueTournament {
  id: number;
  name: string;
  stYear: number;
  fnYear: number | null;
  leagueId: number;
  seasonLabel: string;
  stages: TournamentStage[];
}

export interface LeagueTournamensResult {
  items: LeagueTournament[];
  total: number;
}

export interface LeagueDataState {
  status: LeagueDataStatus;
  data: LeagueTournamensResult | null;
  error: string | null;
}
