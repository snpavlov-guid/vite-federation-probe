import { loadEnv } from 'vite'

function pickViteProcessEnv(): Record<string, string> {
  const out: Record<string, string> = {}
  for (const [key, value] of Object.entries(process.env)) {
    if (key.startsWith('VITE_') && value !== undefined) {
      out[key] = value
    }
  }
  return out
}

/** Merge .env loadEnv with process.env VITE_* (Docker / CI overrides). */
export function resolveHostEnv(mode: string): Record<string, string> {
  const fromFiles = loadEnv(mode, process.cwd(), '')
  return { ...fromFiles, ...pickViteProcessEnv() }
}
