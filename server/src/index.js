import app from "./app.js"
import connectDB from "./configs/db.js"

import {PORT} from "./configs/db.js"
import {initMail} from "./configs/mail.js"

initMail()
connectDB()

app.listen(PORT, () => {
  console.log(`Server is running on: http://localhost:${PORT}`)
})