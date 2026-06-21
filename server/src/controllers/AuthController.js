import nodemailer from "nodemailer"

import User from "../models/User.js"
import UserOTPVerification from "../models/UserOTPVerification.js"
import { checkDataNull } from "../helpers/checkNull.js"
import { validateUniqueness } from "../helpers/validateUniqueness.js"
import { createOTP } from "../helpers/createOTP.js"
import { transporter } from "../configs/mail.js"
import { createAuthJWT } from "../helpers/createJWT.js"

class AuthController {
    async sendPin (req, res) {
        const {emailOrUsername} = req.body.data
        const isEmail = (val)=>/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val.trim())
        const field = isEmail(emailOrUsername)?'email':'username'
        try {
            const existedData = await User.findOne({[field]: emailOrUsername})
            if (existedData){
                const {otp, expiredAt, expiredDuration} = createOTP()
                await UserOTPVerification.findOneAndUpdate(
                    {userId: existedData._id},
                    {otp, expiredAt},
                    {
                        new: true,
                        upsert: true,
                        runValidators: true
                    }
                )
                const info = await transporter.sendMail({
                    from: '"Unitasker" <no-reply@unitasker.com>',
                    to: existedData.email,
                    subject: 'OTP Code',
                    text: `Your OTP is ${otp}. You have only ${expiredDuration} minutes before this password become invalid.`
                })
                console.log("Preview URL:", nodemailer.getTestMessageUrl(info));
                return res.status(201).json({
                    success: true,
                    state: 'OTP has been sent',
                    userId: existedData._id,
                    email: existedData.email
                })
            } else {
                return res.status(201).json({
                success: false,
                state: 'Send pin failed',
                message: 'There is no matched username or email.'
                })
            }
        } catch (err) {
            console.log(err)
            return res.status(500).json({
                success: false,
                state: 'Send pin failed',
                message: ''
            })
        }
    }

    async checkPin (req, res) {
        const {otp, userId} = req.body
        try {
            const otpVerification = await UserOTPVerification.findOne({userId})
            const user = await User.findOne({_id: userId})
            if (otp === otpVerification.otp && Date.now() < otpVerification.expiredAt){
                const token = createAuthJWT(user._id)
                return res.status(201).json({
                    success: true,
                    state: 'Check pin success',
                    message: 'Please reset your password.',
                    username: user.username,
                    categories: user.categories,
                    token
                })
            } else {
                if (otp !== otpVerification.otp){
                    return res.status(201).json({
                    success: false,
                    state: 'Check pin failed',
                    message: 'The Pin is not matched.'
                })
                } else {
                    return res.status(201).json({
                    success: false,
                    state: 'Check pin failed',
                    message: 'The Pin has been expired, please click "Resend OTP".'
                })
            }}
        } catch (err){
            console.log(err)
            return res.status(500).json({
                success: false,
                state: 'Check pin failed',
                message: ''
            })
        }
    }
    
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
            const token = createAuthJWT(user._id)
                return res.status(201).json({
                    success: true,
                    state: 'Register success',
                    message: 'You have now logged in.',
                    username: user.username,
                    categories: user.categories,
                    token
                })
        } catch (err) {
            console.log(err)
            return res.status(500).json({
                success: false,
                state: 'Register failed',
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
            if (existedData && await existedData.comparePassword(data['password'])){
                const token = createAuthJWT(existedData._id)
                return res.status(201).json({
                    success: true,
                    state: 'Login success',
                    message: 'You have now logged in.',
                    username: existedData.username,
                    categories: existedData.categories,
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
                state: 'Login failed',
                message: ''
            })
        }
    }

    async edit (req, res) {
        const data = checkDataNull({...req.body})
        const _id = req.user.id
        try {
            const user = await User.findOne({_id})
            if (data.oldPassword && user.password !== data.oldPassword){
                return res.status(202).json({
                    success:false,
                    state: 'Profile can not be edited',
                    message: 'Old password is not matched.'
                })
            }
            await User.findOneAndUpdate({_id}, data, {new: true})
            return res.status(201).json({
                success: true,
                state: 'Profile is edited',
                message: data.password? 'Password is updated successfully.' : 'You now can view in the profile page.'
            })
        } catch (err){
            console.log(err)
            return res.status(500).json({
                success: false,
                state: 'Profile is not editted',
                message: ''
            })
        }
    }
}

const authController = new AuthController
export default authController