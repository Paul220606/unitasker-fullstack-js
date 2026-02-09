import express from 'express'

import authMiddleware from '../middlewares/authMiddlewares.js'
import taskController from '../controllers/TaskController.js'

const taskRouter = express.Router()

taskRouter.get('/list', authMiddleware, taskController.list)
taskRouter.post('/create', authMiddleware, taskController.create)


export default taskRouter