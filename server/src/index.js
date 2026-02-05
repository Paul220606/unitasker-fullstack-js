import bodyParser from "body-parser"
import express from "express"
import cors from "cors"

import connectDB from "./configs/db.js"
import route from "./routes/index.js"
import { PORT } from "./configs/env.js"

const app = express()
app.use(bodyParser.json())

app.use(cors({
  origin: "http://localhost:5173",
}))

route(app)

connectDB()

app.listen(PORT, () => {
    console.log(`Server is running on: http://localhost:${PORT}`)
})