import type { RootState } from '../../../app/store';

export const selectLeagueDataStatus = (state: RootState) => state.leagueData.status;
export const selectLeagueDataError = (state: RootState) => state.leagueData.error;
export const selectLeagueTournamensResult = (state: RootState) => state.leagueData.data;
export const selectLeagueTournamentItems = (state: RootState) => state.leagueData.data?.items ?? [];
export const selectLeagueTournamentTotal = (state: RootState) => state.leagueData.data?.total ?? 0;
export const selectLeagueStandingsStatus = (state: RootState) => state.leagueData.standingsStatus;
export const selectLeagueStandingsError = (state: RootState) => state.leagueData.standingsError;
export const selectLeagueStandingsGroups = (state: RootState) => state.leagueData.standingsData;
export const selectLeagueStandingsItems = (state: RootState) =>
  state.leagueData.standingsData[0]?.items ?? [];
export const selectLeagueTournamentMatchesStatus = (state: RootState) =>
  state.leagueData.tournamentMatchesStatus;
export const selectLeagueTournamentMatchesError = (state: RootState) =>
  state.leagueData.tournamentMatchesError;
export const selectLeagueTournamentMatchesData = (state: RootState) =>
  state.leagueData.tournamentMatchesData;
export const selectLeagueTournamentTeams = (state: RootState) =>
  state.leagueData.tournamentMatchesData?.teams ?? [];
export const selectLeagueTournamentMatches = (state: RootState) =>
  state.leagueData.tournamentMatchesData?.matches ?? [];
