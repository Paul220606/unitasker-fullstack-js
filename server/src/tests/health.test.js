import { describe, it, expect } from 'vitest'
import request from 'supertest'
import mongoose from 'mongoose'
import app from '../app.js'

describe('GET /api/health', () => {
    it('should return 200 with { ok: true }', async () => {
        const res = await request(app).get('/api/health')
        expect(res.status).toBe(200)
        expect(res.body).toEqual({ ok: true })
    })

    it('should respond even when the database is not connected', async () => {
        expect(mongoose.connection.readyState).toBe(0)
        const res = await request(app).get('/api/health')
        expect(res.status).toBe(200)
    })

    it('should not require an auth token', async () => {
        const res = await request(app).get('/api/health')
        expect(res.status).not.toBe(401)
    })
})