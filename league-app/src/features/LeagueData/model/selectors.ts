import type { RootState } from '../../../app/store';

export const selectLeagueDataStatus = (state: RootState) => state.leagueData.status;
export const selectLeagueDataError = (state: RootState) => state.leagueData.error;
export const selectLeagueTournamensResult = (state: RootState) => state.leagueData.data;
export const selectLeagueTournamentItems = (state: RootState) => state.leagueData.data?.items ?? [];
export const selectLeagueTournamentTotal = (state: RootState) => state.leagueData.data?.total ?? 0;
export const selectLeagueStandingsStatus = (state: RootState) => state.leagueData.standingsStatus;
export const selectLeagueStandingsError = (state: RootState) => state.leagueData.standingsError;
export const selectLeagueStandingsItems = (state: RootState) => state.leagueData.standingsData;
