import express from 'express'
import authController from '../controllers/AuthController.js'

const authRouter = express.Router()

authRouter.post('/checkPin', authController.checkPin)
authRouter.post('/sendPin', authController.sendPin)
authRouter.post('/register', authController.register)
authRouter.post('/login', authController.login)

export default authRouter