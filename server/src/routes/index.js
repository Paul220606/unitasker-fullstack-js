import authRouter from './authRouter.js'
import taskRouter from './taskRouter.js'
import siteRouter from './siteRouter.js'

const route = (app) => {
    app.use('/api/auth', authRouter)
    app.use('/api/task', taskRouter)
    app.use('/api', siteRouter)
}

export default route
