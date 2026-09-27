import nodemailer from "nodemailer"
import bcrypt from "bcrypt"
import User from "../models/User.js"
import UserOTPVerification from "../models/UserOTPVerification.js"
import { checkDataNull } from "../helpers/checkNull.js"
import { validateUniqueness } from "../helpers/validateUniqueness.js"
import { createOTP } from "../helpers/createOTP.js"
import { transporter } from "../configs/mail.js"
import { createAuthJWT } from "../helpers/createJWT.js"

class AuthController {
    async generateAndSendOTP(user) {
        const {otp, expiredAt, expiredDuration} = createOTP()
        const otpHash = await bcrypt.hash(otp, 10)
        await UserOTPVerification.findOneAndUpdate(
            {userId: user._id},
            {otp: otpHash, expiredAt, attempts: 0},
            {
                new: true,
                upsert: true,
                runValidators: true
            }
        )
        const info = await transporter.sendMail({
            from: '"Unitasker" <no-reply@unitasker.com>',
            to: user.email,
            subject: 'OTP Code',
            text: `Your OTP is ${otp}. You have only ${expiredDuration} minutes before this password become invalid.`
        })
        console.log("Preview URL:", nodemailer.getTestMessageUrl(info));
    }

    async sendPin (req, res) {
        const {emailOrUsername} = req.body.data
        const isEmail = (val)=>/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val.trim())
        const field = isEmail(emailOrUsername)?'email':'username'
        try {
            const existedData = await User.findOne({[field]: emailOrUsername})
            if (existedData){
                await authController.generateAndSendOTP(existedData)
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
        const MAX_ATTEMPTS = 5
        try {
            const otpVerification = await UserOTPVerification.findOneAndUpdate(
                { userId, attempts: { $lt: MAX_ATTEMPTS } },
                { $inc: { attempts: 1 } },
                { new: true }
            )
            if (!otpVerification) {
                return res.status(429).json({
                    success: false,
                    state: 'Check pin failed',
                    message: 'Too many attempts. Please click "Resend OTP".'
                })
            }

            if (Date.now() >= otpVerification.expiredAt) {
                return res.status(201).json({
                    success: false,
                    state: 'Check pin failed',
                    message: 'The Pin has been expired, please click "Resend OTP".'
                })
            }
            
            const isMatch = await bcrypt.compare(String(otp), otpVerification.otp)
            if (!isMatch) {
                return res.status(201).json({
                    success: false,
                    state: 'Check pin failed',
                    message: `The Pin is not matched. ${MAX_ATTEMPTS - otpVerification.attempts} attempt(s) left.`
                })
            }

            await UserOTPVerification.deleteOne({userId})
            const user = await User.findById(userId)
            const token = createAuthJWT(user._id)
            return res.status(201).json({
                success: true,
                state: 'Check pin success',
                message: 'Please reset your password.',
                username: user.username,
                categories: user.categories,
                token
            })
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
                if (existedData.twoFactorEnabled) {
                    await authController.generateAndSendOTP(existedData)
                    return res.status(201).json({
                        success: true,
                        state: 'OTP has been sent',
                        userId: existedData._id,
                        email: existedData.email,
                        requiresTwoFactor: true,
                    })
                } 
                else {
                    const token = createAuthJWT(existedData._id)
                    return res.status(201).json({
                        success: true,
                        state: 'Login success',
                        message: 'You have now logged in.',
                        username: existedData.username,
                        categories: existedData.categories,
                        token
                    })
                }
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

    async guestLogin(req, res) {
        try {
            const guest = await User.findOne({username: 'demo'})
            if (!guest) {
                return res.status(404).json({success: false, state: 'Login failed', message: 'Demo account not found'})
            }
            const token = createAuthJWT(guest._id)
            return res.status(200).json({
                success: true,
                state: 'Guest login success',
                message: 'You are now viewing as a guest.',
                username: guest.username,
                categories: guest.categories,
                token
            })
        } catch (err) {
            console.log(err)
            return res.status(500).json({success: false})
        }
    }

    async edit (req, res) {
        const data = checkDataNull({...req.body})
        const _id = req.user.id
        try {
            const user = await User.findOne({_id})
            if (data.oldPassword && !await user.comparePassword(data.oldPassword)){
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