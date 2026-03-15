export type LeagueDataStatus = 'idle' | 'loading' | 'succeeded' | 'failed';

export interface TournamentStage {
  id: number;
  name: string;
  order: number;
  leagueId: number;
  tournamentId: number;
  stageType?: string | number | null;
  groups?: string[] | null;
  prevStageId?: number | null;
  prevPlays?: string | null;
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

export interface StandingItem {
  place: number;
  teamId: number;
  teamName: string;
  teamLogo: string;
  matches: number;
  wins: number;
  draw: number;
  lost: number;
  points: number;
  scored: number;
  missed: number;
  diff: number;
  hMatches: number;
  hWins: number;
  hDraw: number;
  hLost: number;
  hPoints: number;
  hScored: number;
  hMissed: number;
  hDiff: number;
  gMatches: number;
  gWins: number;
  gDraw: number;
  gLost: number;
  gPoints: number;
  gScored: number;
  gMissed: number;
  gDiff: number;
}

export interface StandingsGroupBlock {
  group: string | null;
  items: StandingItem[];
}

export interface TeamItem {
  id: number;
  name: string;
  shortName: string;
  city: string;
  logoUrl: string;
}

export interface MatchItem {
  id: number;
  tour: number;
  round: string;
  date: string;
  hScore: number;
  gScore: number;
  city: string;
  stadium: string;
  group: string;
  leagueId: number;
  tournamentId: number;
  stageId: number;
  hTeamId: number;
  gTeamId: number;
}

export interface TournamentMatchesData {
  teams: TeamItem[];
  matches: MatchItem[];
}

export interface LeagueDataState {
  status: LeagueDataStatus;
  data: LeagueTournamensResult | null;
  error: string | null;
  standingsStatus: LeagueDataStatus;
  standingsData: StandingsGroupBlock[];
  standingsError: string | null;
  tournamentMatchesStatus: LeagueDataStatus;
  tournamentMatchesData: TournamentMatchesData | null;
  tournamentMatchesError: string | null;
}
