import {GoogleGenerativeAI} from "@google/generative-ai"
import {GEMINIKEY} from "./env.js"

const genAI = new GoogleGenerativeAI(GEMINIKEY)
const model = genAI.getGenerativeModel({model: "gemini-1.5-flash"})


export {model}