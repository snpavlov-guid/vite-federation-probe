import type { RootState } from '../../../app/store';

export const selectLeagueDataStatus = (state: RootState) => state.leagueData.status;
export const selectLeagueDataError = (state: RootState) => state.leagueData.error;
export const selectRplTournaments = (state: RootState) => state.leagueData.data;
