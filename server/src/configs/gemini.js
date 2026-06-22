import {GoogleGenerativeAI} from "@google/generative-ai"
import {GEMINIKEY} from "./env.js"

const genAI = new GoogleGenerativeAI(GEMINI_API_KEY)
const model = genAI.getGenerativeModel({model: "gemini-1.5-flash"})


export {model}