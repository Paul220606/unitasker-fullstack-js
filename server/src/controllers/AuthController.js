
import User from "../models/User.js"
import { checkDataNull } from "../helpers/checkNull.js"
import { validateUniqueness } from "../helpers/validateUniqueness.js"
import { createAuthJWT } from "../helpers/createJWT.js"

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
            const token = createAuthJWT(data._id)
                return res.status(201).json({
                    success: true,
                    state: 'Register success',
                    message: 'You have now logged in.',
                    username: data.username,
                    token
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
    
    async login (req, res) {
        const data = checkDataNull({...req.body})
        const isEmail = (val)=>/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val.trim())
        const field = isEmail(data['emailOrUsername'])?'email':'username'
        try {
            const existedData = await User.findOne({[field]: data['emailOrUsername']})
            if (existedData && existedData['password'] === data['password']){
                const token = createAuthJWT(existedData._id)
                return res.status(201).json({
                    success: true,
                    state: 'Login success',
                    message: 'You have now logged in.',
                    username: existedData.username,
                    token
                })
            } else {
                return res.status(201).json({
                    success: false,
                    state: 'Login failed',
                    message: 'Email, username or password is incorrect.'
                })
            }
        } catch (err) {
            console.log(err)
            return res.status(500).json({
                success: false,
                title: 'Login failed',
                message: ''
            })
        }
    }
}

const authController = new AuthController
export default authController