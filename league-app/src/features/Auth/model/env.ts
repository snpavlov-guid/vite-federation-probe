const getRequiredEnv = (name: keyof ImportMetaEnv): string => {
  const value = import.meta.env[name];

  if (!value || !value.trim()) {
    throw new Error(`Missing required environment variable: ${name}`);
  }

  return value.trim();
};

export const authEnv = {
  url: getRequiredEnv('VITE_APP_AUTH_URL'),
  realm: getRequiredEnv('VITE_APP_AUTH_REALM'),
  clientId: getRequiredEnv('VITE_APP_AUTH_CLIENTID'),
};
