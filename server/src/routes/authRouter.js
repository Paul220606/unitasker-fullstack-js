import express from 'express'
const authRouter = express.Router()

import authController from '../controllers/AuthController.js'

authRouter.post('/register', authController.register)

export default authRouter