import mongoose from 'mongoose'

const Schema = mongoose.Schema

const User = new Schema({
    username: {type: String, unique: true},
    email: {type: String, unique: true},
    password: String
}, {
    timestamps: true
})

export default mongoose.model('User', User)