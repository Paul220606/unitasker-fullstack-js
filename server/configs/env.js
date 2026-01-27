import dotenv from "dotenv"
dotenv.config()

export const PORT = process.env.PORT || 3000
export const MONGOURL = process.env.MONGO_URL

if (!MONGO_URL) {
    throw new Error("Missing MONGO_URL")
}