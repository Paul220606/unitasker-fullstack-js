import jwt from "jsonwebtoken"
import { JWTSECRET } from "../configs/env.js"

export function createAuthJWT(id, username) {
    return jwt.sign(
        {
            id,
            username,
        },
        JWTSECRET,
        { expiresIn: "2h" }
    )
}