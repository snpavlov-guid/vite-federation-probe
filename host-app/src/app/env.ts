const SENSITIVE_KEY_PATTERN =
  /SECRET|TOKEN|PASSWORD|PASS|API_KEY|AUTH|CREDENTIAL|KEY$/i;

const isNonEmptyString = (value: unknown): value is string =>
  typeof value === 'string' && value.trim().length > 0;

const getWindowEnv = (): Record<string, string> => {
  if (typeof window === 'undefined') {
    return {};
  }

  const runtimeEnv = window.app?.env;
  if (!runtimeEnv || typeof runtimeEnv !== 'object') {
    return {};
  }

  return runtimeEnv as Record<string, string>;
};

export const getEnv = (name: keyof ImportMetaEnv): string | undefined => {
  const windowValue = getWindowEnv()[name as string];
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
    throw new Error(`Missing required environment variable: ${String(name)}`);
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

export const maskEnvValueForLog = (key: string, value: unknown): unknown => {
  if (!isNonEmptyString(value)) {
    return value;
  }
  if (SENSITIVE_KEY_PATTERN.test(key)) {
    return '***';
  }
  return value;
};

export const maskEnvForLog = (env: Record<string, unknown>): Record<string, unknown> => {
  const out: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(env)) {
    out[key] = maskEnvValueForLog(key, value);
  }
  return out;
};

export const getAllEnvForLog = (): Record<string, unknown> =>
  maskEnvForLog(getAllEnv());
