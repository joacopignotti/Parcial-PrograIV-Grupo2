import { defineConfig } from '@playwright/test';

export default defineConfig({
    testDir: 'tests/e2e',
    timeout: 30_000,
    retries: 1,
    workers: 1, 
    reporter: [['html'], ['list']],
    use: {
        baseURL: 'http://localhost:3000',
        trace: 'on-first-retry',
    },
    webServer: {
            command: 'cross-env NODE_ENV=test node dist/server.js',
            port: 3000,
            timeout: 120 * 1000,
            reuseExistingServer: false,
        },
});