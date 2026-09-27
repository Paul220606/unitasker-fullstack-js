import { MOCK_API_URL } from './constants.js'

export const VALID_OTP = '123456'
export const USER = { id: 'u1', username: 'paul', email: 'paul@test.com', categories: 'Housework, Schoolwork, Job, Other' }

const json = (status, body) => ({ status, contentType: 'application/json', body: JSON.stringify(body) })

const defaultHandlers = {
    '/home/render': () => json(201, {
        recentTasks: [],
        stats: [{ title: 'All Tasks', value: 0, icon: 'bi bi-list-task' }],
    }),
}

const CORS_HEADERS = {
    'access-control-allow-origin': '*',
    'access-control-allow-methods': 'GET, POST, PUT, PATCH, DELETE, OPTIONS',
    'access-control-allow-headers': 'Content-Type, Authorization',
}

export async function mockApi(page, handlers = {}) {
    const all = { ...defaultHandlers, ...handlers }
    const calls = {}

    await page.route(`${MOCK_API_URL}/**`, async (route) => {
        const request = route.request()

        if (request.method() === 'OPTIONS') {
            return route.fulfill({ status: 204, headers: CORS_HEADERS })
        }

        const path = new URL(request.url()).pathname.replace(/^\/api/, '')
        calls[path] = (calls[path] || 0) + 1

        const handler = all[path]
        const body = request.postDataJSON?.() ?? null
        const res = handler ? handler(body, calls[path]) : json(200, { success: true })
        return route.fulfill({ ...res, headers: CORS_HEADERS })
    })
    return calls
}

export const twoFactorLogin = () => json(201, {
    success: true,
    state: 'OTP has been sent',
    userId: USER.id,
    email: USER.email,
    requiresTwoFactor: true,
})

export const wrongCredentials = () => json(201, {
    success: false,
    state: 'Login failed',
    message: 'Email, username or password is incorrect.',
})

export const checkPinHandler = (body, callCount) => {
    if (callCount > 5) {
        return json(429, { success: false, state: 'Check pin failed', message: 'Too many attempts. Please click "Resend OTP".' })
    }
    if (body?.otp === VALID_OTP) {
        return json(201, {
            success: true,
            state: 'Check pin success',
            message: 'Please reset your password.',
            username: USER.username,
            categories: USER.categories,
            token: 'fake.jwt.token',
        })
    }
    return json(201, {
        success: false,
        state: 'Check pin failed',
        message: `The Pin is not matched. ${5 - callCount} attempt(s) left.`,
    })
}
