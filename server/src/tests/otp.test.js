import {describe, it, expect, beforeAll, afterAll, beforeEach, vi} from 'vitest'
import { connectTestDB, closeTestDB, clearCollection } from './setup.js'
import request from 'supertest'
import bcrypt from 'bcrypt'
import app from '../app.js'
import User from '../models/User.js'
import UserOTPVerification from '../models/UserOTPVerification.js'

const sentMails = []
vi.mock('../configs/mail.js', () => ({
    initMail:vi.fn(),
    transporter: {
        sendMail: vi.fn(async (mail)=> {
            sentMails.push(mail)
            return {messageId: 'test'}
        })
    }
}))

const MAX_ATTEMPTS = 5
const KNOWN_OTP = '123456'

let user

beforeAll(async () => {
    await connectTestDB()
})

afterAll(async () => {
    await closeTestDB()
})

beforeEach(async() => {
    await clearCollection(User)
    await clearCollection(UserOTPVerification)
    sentMails.length = 0
    user = await User.create({
        fullName: 'OTP User',
        username: 'otpuser',
        email: 'otp@test.com',
        password: 'Test123!',
        twoFactorEnabled: true
    })
})

const seedOTP = async ({otp = KNOWN_OTP, expiresInMs = 5*60*1000, attempts = 0} = {}) => {
    await UserOTPVerification.create({
        userId: user._id,
        otp: await bcrypt.hash(otp, 10),
        expiredAt: new Date(Date.now() + expiresInMs),
        attempts
    })
}

const checkPin = (otp) => request(app).post('/api/auth/checkPin').send({ userId: user._id.toString(), otp })

describe('POST /api/auth/checkPin', () => {
    it('should succeed and return a token with the correct OTP', async () => {
        await seedOTP()
        const res = await checkPin(KNOWN_OTP)
        expect(res.status).toBe(201)
        expect(res.body.success).toBe(true)
        expect(res.body.token).toBeDefined()
    })

    it('should delete the OTP after successful use (no replay)', async () => {
        await seedOTP()
        await checkPin(KNOWN_OTP)
        const replay = await checkPin(KNOWN_OTP)
        expect(replay.status).toBe(429)
        expect(replay.body.success).toBe(false)
        expect(await UserOTPVerification.findOne({ userId: user._id })).toBeNull()
    })

    it('should fail with a wrong OTP and report remaining attempts', async () => {
        await seedOTP()
        const res = await checkPin('000000')
        expect(res.status).toBe(401)
        expect(res.body.success).toBe(false)
        expect(res.body.message).toContain(`${MAX_ATTEMPTS - 1} attempt(s) left`)
    })

    it('should fail when the OTP has expired, even if correct', async() => {
        await seedOTP({expiresInMs: -1000})
        const res = await checkPin(KNOWN_OTP)
        expect(res.status).toBe(410)
        expect(res.body.success).toBe(false)
        expect(res.body.message).toContain('expired')
        expect(res.body.token).toBeUndefined()
    })

    it(`should lock after ${MAX_ATTEMPTS} wrong attempts, even for the correct OTP`, async() => {
        await seedOTP()
        for (let i = 0; i<MAX_ATTEMPTS; i++){
            await checkPin('000000')
        }
        const res = await checkPin(KNOWN_OTP)
        expect(res.status).toBe(429)
        expect(res.body.success).toBe(false)
        expect(res.body.token).toBeUndefined()
    })

    it('should allow at most 5 attempts under 20 concurrent requests', async () => {
        await seedOTP()
        const results = await Promise.all(
            Array.from({length: 20}, () => checkPin('000000'))
        )
        const evaluated = results.filter(r => r.status !== 429)
        const blocked = results.filter(r => r.status === 429)
        expect(evaluated.length).toBe(MAX_ATTEMPTS)
        expect(blocked.length).toBe(20-MAX_ATTEMPTS)

        const record = await UserOTPVerification.findOne({userId: user._id})
        expect(record.attempts).toBe(MAX_ATTEMPTS)
    })

    it('should return 429 when no OTP was ever requested', async () => {
        const res = await checkPin(KNOWN_OTP)
        expect(res.status).toBe(429)
        expect(res.body.success).toBe(false)
    })
})

describe('2FA login flow (end to end)', () => {
    it('should email the OTP, store only its hash, and accept it at checkPin', async() => {
        const loginRes = await request(app)
                        .post('/api/auth/login')
                        .send({ emailOrUsername: 'otpuser', password: 'Test123!' })
        expect(loginRes.body.requiresTwoFactor).toBe(true)
        expect(loginRes.body.token).toBeUndefined()

        expect(sentMails.length).toBe(1)
        const otp = sentMails[0].text.match(/\d{6}/)[0]

        const record = await UserOTPVerification.findOne({userId: user._id})
        expect(record.otp).not.toBe(otp)
        expect(record.otp.startsWith('$2')).toBe(true)

        const res = await checkPin(otp)
        expect(res.body.success).toBe(true)
        expect(res.body.token).toBeDefined()
    })

    it('should reset attempts when a new OTP is sent', async()=>{
        await seedOTP({attempts: MAX_ATTEMPTS})
        await request(app).post('/api/auth/sendPin').send({data: {emailOrUsername: 'otpuser'}})
        const record = await UserOTPVerification.findOne({userId: user._id})
        expect(record.attempts).toBe(0)
    })
})