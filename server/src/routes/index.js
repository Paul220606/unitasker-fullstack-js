import authRouter from './authRouter.js'
const route = (app) => {
    app.use('/api/auth', authRouter)
}

export default route
