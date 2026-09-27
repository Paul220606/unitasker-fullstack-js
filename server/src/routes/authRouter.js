import express from 'express'
import authController from '../controllers/AuthController.js'
import authMiddleware from '../middlewares/authMiddlewares.js'
import { otpSendLimiter, loginLimiter, registerLimiter } from '../middlewares/rateLimiters.js'

const authRouter = express.Router()

authRouter.post('/checkPin', authController.checkPin)
authRouter.post('/sendPin', otpSendLimiter, authController.sendPin)
authRouter.post('/register', registerLimiter, authController.register)
authRouter.post('/login', loginLimiter, authController.login)
authRouter.post('/guest', authController.guestLogin)
authRouter.post('/edit', authMiddleware, authController.edit)

export default authRouter