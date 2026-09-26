import { describe, it, expect, beforeAll, afterAll, beforeEach } from 'vitest'
import request from 'supertest'
import app from '../app.js'
import User from '../models/User.js'
import { connectTestDB, closeTestDB, clearCollection } from './setup.js'

beforeAll(async () => {
    await connectTestDB()
})

afterAll(async () => {
    await closeTestDB()
})

beforeEach(async () => {
    await clearCollection(User)
})

const validUser = {
    fullName: 'Test User',
    username: 'testuser1',
    email: 'test@test.com',
    password: 'Test123!'
}

describe('POST /api/auth/register', () => {
    it('should register a new user successfully', async () => {
        const res = await request(app)
            .post('/api/auth/register')
            .send(validUser)
        expect(res.status).toBe(201)
        expect(res.body.success).toBe(true)
        expect(res.body.username).toBe(validUser.username)
    })

    it('should fail if username already exists', async () => {
        await request(app).post('/api/auth/register').send(validUser)
        const res = await request(app).post('/api/auth/register').send(validUser)
        expect(res.body.success).toBe(false)
    })

    it('should fail if required fields are missing', async () => {
        const res = await request(app)
            .post('/api/auth/register')
            .send({ username: 'testuser1' })
        expect(res.body.success).toBe(false)
    })
})

describe('POST /api/auth/login', () => {
    beforeEach(async () => {
        await request(app).post('/api/auth/register').send(validUser)
    })

    it('should login successfully with correct credentials', async () => {
        const res = await request(app)
            .post('/api/auth/login')
            .send({
                emailOrUsername: validUser.username,
                password: validUser.password
            })
        expect(res.status).toBe(201)
        expect(res.body.success).toBe(true)
        expect(res.body.token).toBeDefined()
    })

    it('should fail with wrong password', async () => {
        const res = await request(app)
            .post('/api/auth/login')
            .send({
                emailOrUsername: validUser.username,
                password: 'wrongpassword'
            })
        expect(res.body.success).toBe(false)
    })

    it('should fail with non-existent username', async () => {
        const res = await request(app)
            .post('/api/auth/login')
            .send({
                emailOrUsername: 'nobody',
                password: 'Test123!'
            })
        expect(res.body.success).toBe(false)
    })

    it('should login with email instead of username', async () => {
        const res = await request(app)
            .post('/api/auth/login')
            .send({
                emailOrUsername: validUser.email,
                password: validUser.password
            })
        expect(res.body.success).toBe(true)
        expect(res.body.token).toBeDefined()
    })
})

describe('POST /api/auth/guest', () => {
    it('should login as guest successfully', async () => {
        await User.create({
            fullName: 'Demo User',
            username: 'demo',
            email: 'demo@unitasker.com',
            password: 'Demo123!',
            categories: 'Housework, Schoolwork, Job, Other'
        })
        const res = await request(app).post('/api/auth/guest')
        expect(res.status).toBe(200)
        expect(res.body.success).toBe(true)
        expect(res.body.token).toBeDefined()
    })

    it('should fail if demo account does not exist', async () => {
        const res = await request(app).post('/api/auth/guest')
        expect(res.body.success).toBe(false)
    })
})