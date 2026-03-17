import { getRequiredEnv } from '../../../app/env';

export const authEnv = {
  url: getRequiredEnv('VITE_APP_AUTH_URL'),
  realm: getRequiredEnv('VITE_APP_AUTH_REALM'),
  clientId: getRequiredEnv('VITE_APP_AUTH_CLIENTID'),
};
