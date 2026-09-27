import { test, expect } from '@playwright/test'
import { mockApi, twoFactorLogin, wrongCredentials, checkPinHandler, VALID_OTP, USER } from './mockApi.js'

const loginForm = (page) => page.locator('form.auth-form')
const otpModal = (page) => page.locator('#otpModal')
const otpInputs = (page) => otpModal(page).getByRole('textbox')

async function submitLogin(page) {
    const form = loginForm(page)
    await form.locator('#emailOrUsername').fill(USER.username)
    await form.locator('#password').fill('Test123!')
    await form.locator('button[type="submit"]').click()
}

async function typeOtp(page, code) {
    await otpInputs(page).first().click()
    await page.keyboard.type(code)
}

test.describe('Login page', () => {
    test('renders an accessible login form', async ({ page }) => {
        await mockApi(page)
        await page.goto('/login')

        await expect(page.getByRole('heading', { level: 1, name: 'Log in' })).toBeVisible()
        await expect(page.locator('main')).toHaveCount(1)
        await expect(page).toHaveTitle(/Unitasker/)
    })

    test('password visibility toggle has an accessible name and works', async ({ page }) => {
        await mockApi(page)
        await page.goto('/login')
        await expect(page.getByRole('heading', { level: 1, name: 'Log in' })).toBeVisible()

        const form = loginForm(page)
        const password = form.locator('#password')
        const toggle = form.getByRole('button', { name: 'Show password' })

        await expect(password).toHaveAttribute('type', 'password')
        await toggle.click()
        await expect(password).toHaveAttribute('type', 'text')
        await expect(form.getByRole('button', { name: 'Hide password' })).toHaveAttribute('aria-pressed', 'true')
    })

    test('shows the server error on wrong credentials', async ({ page }) => {
        await mockApi(page, { '/auth/login': wrongCredentials })
        await page.goto('/login')
        await submitLogin(page)

        await expect(page.getByText('Email, username or password is incorrect.').first()).toBeVisible()
        await expect(page).toHaveURL(/\/login$/)
    })
})

test.describe('Two-factor login (OTP)', () => {
    test('wrong code keeps the modal open; correct code logs in', async ({ page }) => {
        await mockApi(page, { '/auth/login': twoFactorLogin, '/auth/checkPin': checkPinHandler })
        await page.goto('/login')
        await submitLogin(page)

        await expect(otpModal(page)).toBeVisible()
        await expect(otpInputs(page)).toHaveCount(6)

        await typeOtp(page, '000000')
        await otpModal(page).getByRole('button', { name: 'Confirm' }).click()
        await expect(page.getByText(/4 attempt\(s\) left/).first()).toBeVisible()
        await expect(otpModal(page)).toBeVisible()
        await expect(otpInputs(page).first()).toHaveValue('')

        await typeOtp(page, VALID_OTP)
        await otpModal(page).getByRole('button', { name: 'Confirm' }).click()
        await expect(page).toHaveURL(/\/$/)
        await expect(page.getByRole('heading', { name: `Welcome back, ${USER.username}!` })).toBeVisible()
        await expect(page.locator('.modal-backdrop')).toHaveCount(0)
    })

    test('shows the lockout message after too many wrong codes (HTTP 429)', async ({ page }) => {
        await mockApi(page, { '/auth/login': twoFactorLogin, '/auth/checkPin': checkPinHandler })
        await page.goto('/login')
        await submitLogin(page)
        await expect(otpModal(page)).toBeVisible()

        for (let i = 0; i < 6; i++) {
            await typeOtp(page, '000000')
            await otpModal(page).getByRole('button', { name: 'Confirm' }).click()
            await expect(otpInputs(page).first()).toHaveValue('')
        }

        await expect(page.getByText('Too many attempts. Please click "Resend OTP".').first()).toBeVisible()
        await expect(otpModal(page)).toBeVisible()
    })

    test('an autofilled code is spread across all six boxes', async ({ page }) => {
        await mockApi(page, { '/auth/login': twoFactorLogin })
        await page.goto('/login')
        await submitLogin(page)
        await expect(otpModal(page)).toBeVisible()

        await otpInputs(page).first().fill(VALID_OTP)

        const values = await otpInputs(page).evaluateAll((inputs) => inputs.map((i) => i.value).join(''))
        expect(values).toBe(VALID_OTP)
        await expect(otpModal(page).getByRole('button', { name: 'Confirm' })).toBeEnabled()
    })

    test('OTP boxes open a numeric keyboard and support autofill', async ({ page }) => {
        await mockApi(page, { '/auth/login': twoFactorLogin })
        await page.goto('/login')
        await submitLogin(page)
        await expect(otpModal(page)).toBeVisible()

        const first = otpInputs(page).first()
        await expect(first).toHaveAttribute('inputmode', 'numeric')
        await expect(first).toHaveAttribute('autocomplete', 'one-time-code')
        await expect(first).toHaveAccessibleName('Digit 1 of 6')
    })
})
