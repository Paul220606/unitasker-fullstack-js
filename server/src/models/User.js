import mongoose from 'mongoose'

const Schema = mongoose.Schema

const User = new Schema({
    username: {type: String, unique: true, required: true},
    email: {type: String, unique: true, required: true},
    password: {type: String, required: true}
}, {
    timestamps: true
})

export default mongoose.model('User', User)