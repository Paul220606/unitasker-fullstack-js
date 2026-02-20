import mongoose from 'mongoose'

const Schema = mongoose.Schema

const UserOTPVerification = new Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    otp: {type: String, required: true},
    expiredAt: {type: Date, required: true}
}, {
    timestamps: true
})

export default mongoose.model('UserOTPVerification', UserOTPVerification)