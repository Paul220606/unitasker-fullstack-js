import { defineConfig, devices } from '@playwright/test'
import { MOCK_API_URL } from './e2e/constants.js'

const PORT = 4173

export default defineConfig({
    testDir: './e2e',
    fullyParallel: true,
    workers: 2,
    retries: process.env.CI ? 2 : 1,
    expect: { timeout: 10_000 },
    reporter: [['list'], ['html', { open: 'never' }]],

    use: {
        baseURL: `http://localhost:${PORT}`,
        locale: 'en-US',
        trace: 'retain-on-failure',
        screenshot: 'only-on-failure',
    },

    projects: [
        { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
        { name: 'firefox', use: { ...devices['Desktop Firefox'] }, expect: { timeout: 20_000 } },
        { name: 'webkit', use: { ...devices['Desktop Safari'] } },
        { name: 'mobile-chrome', use: { ...devices['Pixel 7'] } },
        { name: 'mobile-safari', use: { ...devices['iPhone 14'] } },
    ],

    webServer: {
        command: `npx vite build --outDir e2e-dist && npx vite preview --outDir e2e-dist --port ${PORT} --strictPort`,
        url: `http://localhost:${PORT}`,
        reuseExistingServer: !process.env.CI,
        timeout: 120_000,
        env: { VITE_API_URL: MOCK_API_URL },
    },
})
