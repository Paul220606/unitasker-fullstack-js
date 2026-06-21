import express from 'express'
import authController from '../controllers/AuthController.js'
import authMiddleware from '../middlewares/authMiddlewares.js'

const authRouter = express.Router()

authRouter.post('/checkPin', authController.checkPin)
authRouter.post('/sendPin', authController.sendPin)
authRouter.post('/register', authController.register)
authRouter.post('/login', authController.login)
authRouter.post('/edit', authMiddleware, authController.edit)

export default authRouter