import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    name: 'backend-integration',
    environment: 'node',
    include: ['src/**/*.integration.test.ts'],
    setupFiles: ['src/test/integration/setup.ts'],
    testTimeout: 30_000,
    hookTimeout: 30_000,
    globals: false,
  },
});
