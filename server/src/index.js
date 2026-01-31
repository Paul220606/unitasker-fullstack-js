import bodyParser from "body-parser"
import express from "express"
import cors from "cors"

import "./configs/env.js"
import connectDB from "./configs/db.js"
import route from "./routes/index.js"


const app = express()
app.use(bodyParser.json())

app.use(cors({
  origin: "http://localhost:5173",
}))

route(app)

connectDB()

const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log(`Server is running on: http://localhost:${PORT}`)
})