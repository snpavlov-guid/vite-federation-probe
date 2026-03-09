import Keycloak from 'keycloak-js';
import { authEnv } from './env';

export const keycloak = new Keycloak({
  url: authEnv.url,
  realm: authEnv.realm,
  clientId: authEnv.clientId,
});

export const initAuth = async (): Promise<void> => {
  const authenticated = await keycloak.init({
    onLoad: 'login-required',
    checkLoginIframe: false,
  });

  if (!authenticated || !keycloak.token) {
    await keycloak.login();
  }
};
