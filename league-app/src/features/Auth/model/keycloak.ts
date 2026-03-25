import Keycloak from 'keycloak-js';
import { authEnv } from './env';

export const keycloak = new Keycloak({
  url: authEnv.url,
  realm: authEnv.realm,
  clientId: authEnv.clientId,
});

let authInitPromise: Promise<void> | null = null;

const runKeycloakInit = async (): Promise<void> => {
  const authenticated = await keycloak.init({
    onLoad: 'login-required',
    checkLoginIframe: false,
  });

  if (!authenticated || !keycloak.token) {
    await keycloak.login();
    return;
  }

  const tokenPayload = keycloak.tokenParsed ?? { token: keycloak.token };
  console.log('Auth token payload:', JSON.stringify(tokenPayload, null, 2));
};

/** Один раз на вкладку; безопасно при StrictMode и при загрузке только exposes (без main.tsx). */
export const initAuth = async (): Promise<void> => {
  if (!authInitPromise) {
    authInitPromise = runKeycloakInit();
  }
  return authInitPromise;
};
