import jwt from "jsonwebtoken"
import { JWTSECRET } from "../configs/env"

const authMiddleware = (req, res, next) => {
    const authHeader = req.headers.authorization

    if (!authHeader){
        return res.status(401).json({message: "No token"})
    }
    const token = authHeader.split(" ")[1]

    try {
        const decoded = jwt.verify(token, JWTSECRET)
        req.user = decoded
        next()
    } catch (err) {
        res.status(401).json({ message: "Invalid token"})
    }
}

export default authMiddleware