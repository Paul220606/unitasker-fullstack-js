import dotenv from "dotenv"
dotenv.config()

export const JWTSECRET = process.env.JWT_SECRET || "unitasker_secret"
export const PORT = process.env.PORT || 3000
export const MONGOURL = process.env.MONGO_URL
export const GMAILUSER = process.env.GMAIL_USER
export const GMAILAPPPASSWORD = process.env.GMAIL_APP_PASSWORD

if (!GMAILUSER) throw new Error("Missing GMAIL_USER")
if (!GMAILAPPPASSWORD) throw new Error("Missing GMAIL_APP_PASSWORD")
if (!MONGOURL) throw new Error("Missing MONGO_URL")