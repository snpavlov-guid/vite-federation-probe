const getRequiredEnv = (name: keyof ImportMetaEnv): string => {
  const value = import.meta.env[name];

  if (!value || !value.trim()) {
    throw new Error(`Missing required environment variable: ${name}`);
  }

  return value.trim();
};

export const leagueDataEnv = {
  apiUrl: getRequiredEnv('VITE_APP_FOOTBALL_APIURL'),
};
