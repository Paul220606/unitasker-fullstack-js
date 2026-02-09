import jwt from "jsonwebtoken"
import { JWTSECRET } from "../configs/env.js"

const createAuthJWT = (id) => {
    return jwt.sign(
        {
            id,
        },
        JWTSECRET,
        { expiresIn: "2h" }
    )
}
export {createAuthJWT}