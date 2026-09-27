import { test, expect } from '@playwright/test'
import { mockApi } from './mockApi.js'

test.describe('Performance regressions', () => {
    test('login page does not download the .docx parser (lazy-loaded)', async ({ page }) => {
        await mockApi(page)
        const scripts = []
        page.on('response', async (response) => {
            if (response.request().resourceType() === 'script') {
                scripts.push(await response.text().catch(() => ''))
            }
        })

        await page.goto('/login')
        await page.waitForLoadState('networkidle')

        expect(scripts.length).toBeGreaterThan(0)
        expect(scripts.some((code) => code.includes('extractRawText'))).toBe(false)
    })

    test('lazy pages load without layout shift (CLS < 0.1)', async ({ page, browserName }) => {
        test.skip(browserName !== 'chromium', 'layout-shift entries are Chromium-only')

        await mockApi(page)
        await page.addInitScript(() => {
            window.__cls = 0
            new PerformanceObserver((list) => {
                for (const entry of list.getEntries()) {
                    if (!entry.hadRecentInput) window.__cls += entry.value
                }
            }).observe({ type: 'layout-shift', buffered: true })
        })

        for (const path of ['/', '/login', '/register']) {
            await page.goto(path)
            await page.waitForLoadState('networkidle')
            const cls = await page.evaluate(() => window.__cls)
            expect(cls, `CLS on ${path}`).toBeLessThan(0.1)
        }
    })
})
