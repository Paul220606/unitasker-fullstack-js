import User from "../models/User.js"
import { checkDataNull } from "../helpers/checkNull.js"
import { validateUniqueness } from "../helpers/validateUniqueness.js"


class AuthController {
    async register (req, res) {
        const uniqueFields = ['username', 'email']
        const data = checkDataNull({...req.body})
        try {
            for (const field of uniqueFields){
                const exist = await validateUniqueness(field, data[field], User)
                if (exist) {
                    return res.json({
                    success: false,
                    state: 'Register failed',
                    message: 'This ' + field + ' has already registered'
                })}
            }

            const user = new User(data)
            await user.save()
            return res.status(201).json({
                success: true,
                state: 'Register success',
                message: ''
            })
        } catch (err) {
            console.log(err)
            return res.status(500).json({
                success: false,
                title: 'Register failed',
                message: ''
            })
        }
    }
}
const authController = new AuthController
export default authController