import {GoogleGenerativeAI} from "@google/generative-ai"
import {GEMINIKEY} from "./env.js"

const genAI = new GoogleGenerativeAI(GEMINIKEY)
const model = genAI.getGenerativeModel({model: "gemini-2.0-flash"})


export {model}