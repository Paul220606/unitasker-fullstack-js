import express from 'express'

import authMiddleware from '../middlewares/authMiddlewares.js'
import siteController from '../controllers/SiteController.js'

const siteRouter = express.Router()


siteRouter.get('/home/render', authMiddleware, siteController.homeRender)


export default siteRouter