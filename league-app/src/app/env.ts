import { useMemo } from 'react';

type RuntimeEnvMap = Record<string, string>;

const isNonEmptyString = (value: unknown): value is string =>
  typeof value === 'string' && value.trim().length > 0;

const getWindowEnv = (): RuntimeEnvMap => {
  if (typeof window === 'undefined') {
    return {};
  }

  const runtimeEnv = window.app?.env;
  if (!runtimeEnv || typeof runtimeEnv !== 'object') {
    return {};
  }

  return runtimeEnv as RuntimeEnvMap;
};

export const getEnv = (name: keyof ImportMetaEnv): string | undefined => {
  const windowValue = getWindowEnv()[name];
  if (isNonEmptyString(windowValue)) {
    return windowValue.trim();
  }

  const viteValue = import.meta.env[name];
  if (isNonEmptyString(viteValue)) {
    return viteValue.trim();
  }

  return undefined;
};

export const getRequiredEnv = (name: keyof ImportMetaEnv): string => {
  const value = getEnv(name);

  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }

  return value;
};

export const getAllEnv = (): Record<string, unknown> => {
  const mergedEnv: Record<string, unknown> = { ...import.meta.env };
  const windowEnv = getWindowEnv();

  Object.entries(windowEnv).forEach(([key, value]) => {
    if (isNonEmptyString(value)) {
      mergedEnv[key] = value.trim();
    }
  });

  return mergedEnv;
};

export const useEnv = () =>
  useMemo(
    () => ({
      get: getEnv,
      getAll: getAllEnv,
      getRequired: getRequiredEnv,
    }),
    [],
  );
