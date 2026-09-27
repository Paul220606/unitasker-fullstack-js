import { describe, it, expect, beforeAll, afterAll, vi } from 'vitest'
import request from 'supertest'
import app from '../app.js'
import { connectTestDB, closeTestDB } from './setup.js'

beforeAll(async () => {
    vi.stubEnv('TEST_RATE_LIMIT', '1')
    await connectTestDB()
})

afterAll(async () => {
    vi.unstubAllEnvs()
    await closeTestDB()
})

describe('Rate limiting', () => {
    it('should block the 4th sendPin request within 15 minutes', async () => {
        const send = () => request(app).post('/api/auth/sendPin')
            .send({ data: { emailOrUsername: 'nobody' } })
        for (let i = 0; i < 3; i++) {
            expect((await send()).status).not.toBe(429)
        }
        const res = await send()
        expect(res.status).toBe(429)
        expect(res.body.success).toBe(false)
    })

    it('should block the 11th login attempt within 15 minutes', async () => {
        const login = () => request(app).post('/api/auth/login')
            .send({ emailOrUsername: 'nobody', password: 'wrong' })
        for (let i = 0; i < 10; i++) {
            expect((await login()).status).not.toBe(429)
        }
        expect((await login()).status).toBe(429)
    })
})