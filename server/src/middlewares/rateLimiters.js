import rateLimit from 'express-rate-limit'

const skipInTests = () =>
    process.env.NODE_ENV === 'test' && process.env.TEST_RATE_LIMIT !== '1'

const base = { standardHeaders: 'draft-7', legacyHeaders: false, skip: skipInTests }

export const otpSendLimiter = rateLimit({
    ...base, windowMs: 15 * 60 * 1000, limit: 3,
    message: { success: false, state: 'Send pin failed', message: 'Too many requests, try again later.' },
})

export const loginLimiter = rateLimit({
    ...base, windowMs: 15 * 60 * 1000, limit: 10,
    skipSuccessfulRequests: true,
    message: { success: false, state: 'Login failed', message: 'Too many attempts, try again later.' },
})

export const registerLimiter = rateLimit({
    ...base, windowMs: 60 * 60 * 1000, limit: 5,
    message: { success: false, state: 'Register failed', message: 'Too many accounts created, try again later.' },
})