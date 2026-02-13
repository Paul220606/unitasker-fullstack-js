import express from 'express'

import authMiddleware from '../middlewares/authMiddlewares.js'
import taskController from '../controllers/TaskController.js'

const taskRouter = express.Router()

taskRouter.get('/list', authMiddleware, taskController.list)
taskRouter.get('/bin', authMiddleware, taskController.listDeleted)
taskRouter.post('/create', authMiddleware, taskController.create)
taskRouter.patch('/edit', authMiddleware, taskController.edit)
taskRouter.patch('/restore', authMiddleware, taskController.restore)
taskRouter.delete('/softDelete', authMiddleware, taskController.softDelete)
taskRouter.delete('/delete', authMiddleware, taskController.delete)

export default taskRouter