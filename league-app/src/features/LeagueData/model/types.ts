export type LeagueDataStatus = 'idle' | 'loading' | 'succeeded' | 'failed';

export interface RplTournamentsResponse {
  [key: string]: unknown;
}

export interface LeagueDataState {
  status: LeagueDataStatus;
  data: RplTournamentsResponse | null;
  error: string | null;
}
