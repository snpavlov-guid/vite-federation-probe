import { getRequiredEnv } from '../../../app/env';

export const leagueDataEnv = {
  apiUrl: getRequiredEnv('VITE_APP_FOOTBALL_APIURL'),
};
