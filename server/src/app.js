import bodyParser from "body-parser"
import express from "express"
import cors from "cors"

import route from "./routes/index.js"

const app = express()

app.use(bodyParser.json())
app.use(cors({
    origin: [
        "http://localhost:5173",
        /\.vercel\.app$/,
    ],
}))

route(app)

export default app