import mongoose from 'mongoose'
import bcrypt from 'bcrypt'

const Schema = mongoose.Schema

const User = new Schema({
    fullName: {type: String, required: true},
    username: {type: String, unique: true, required: true},
    email: {type: String, unique: true, required: true},
    password: {type: String, required: true},
    phone: {type: String},
    location: {type: String},
    imageUrl: {type: String},
    categories: {type: String, required: true, default: 'Housework, Schoolwork, Job, Other'}
}, {
    timestamps: true
})

// Hash password before saved
User.pre('save', async function () {
    if (!this.isModified('password')) return
    this.password = await bcrypt.hash(this.password, 10)
})

// Method to compare password when loging in
User.methods.comparePassword = async function(pass) {
    return bcrypt.compare(pass, this.password)
}

export default mongoose.model('User', User)