import express from 'express'

const router = express.Router()

router.get('/', (req, res) => {
    console.log('API is working!')
    res.json({ message: 'Backend connected successfully 🚀' })
})

export default router
