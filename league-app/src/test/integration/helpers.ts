import { configureStore, type Reducer } from '@reduxjs/toolkit';

const requiredIntegrationEnvVars = [
  'VITE_APP_TEST_AUTH_URL',
  'VITE_APP_TEST_USER',
  'VITE_APP_TEST_PASSWORD',
  'VITE_APP_AUTH_CLIENTID',
  'VITE_APP_FOOTBALL_APIURL',
] as const;

type IntegrationEnvVar = (typeof requiredIntegrationEnvVars)[number];

const readRequiredEnv = (name: IntegrationEnvVar): string => {
  const value = import.meta.env[name];

  if (!value || !value.trim()) {
    throw new Error(`Missing required integration env variable: ${name}.`);
  }

  return value.trim();
};

export const assertEnvForIntegrationTests = (): void => {
  requiredIntegrationEnvVars.forEach(readRequiredEnv);
};

interface TokenResponse {
  access_token?: string;
  [key: string]: unknown;
}

export const getAccessTokenFromTestAuth = async (): Promise<string> => {
  const authUrl = readRequiredEnv('VITE_APP_TEST_AUTH_URL');
  const username = readRequiredEnv('VITE_APP_TEST_USER');
  const password = readRequiredEnv('VITE_APP_TEST_PASSWORD');
  const clientId = readRequiredEnv('VITE_APP_AUTH_CLIENTID');

  const response = await fetch(authUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Accept: 'application/json',
    },
    body: new URLSearchParams({
      grant_type: 'password',
      client_id: clientId,
      username,
      password,
    }),
  });

  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(
      `Failed to get access token (${response.status}): ${errorBody || response.statusText}`,
    );
  }

  const payload = (await response.json()) as TokenResponse;
  const token = payload.access_token;

  if (!token || !token.trim()) {
    throw new Error('Token endpoint did not return access_token.');
  }

  return token;
};

export interface KeycloakStub {
  authenticated: boolean;
  token?: string;
  updateToken: (minValidity: number) => Promise<boolean>;
}

export const createKeycloakStub = (token: string): KeycloakStub => ({
  authenticated: true,
  token,
  updateToken: async () => true,
});

type IntegrationReducers = Record<string, Reducer>;

export const createIntegrationStore = (reducers: IntegrationReducers) =>
  configureStore({
    reducer: reducers,
  });
