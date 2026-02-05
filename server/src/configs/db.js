import mongoose from "mongoose"
import { MONGOURL } from "./env.js"

const connectDB = async () => {
    try {
        await mongoose.connect(MONGOURL)
        console.log("MongoDB connected!!")
    } 
    catch (err) {
        console.log("MongoDB connection failed!!", err.message)
        process.exit(1)
    }
}

export default connectDB