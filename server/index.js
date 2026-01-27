import bodyParser from "body-parser"
import express from "express"

import "./configs/env"
import connectDB from "./configs/db"


const app = express()
app.use(bodyParser.json())

connectDB()

app.listen(PORT, () => {
    console.log(`Server is running on: https://localhost:${PORT}`)
})