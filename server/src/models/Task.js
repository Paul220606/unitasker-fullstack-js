import mongoose from "mongoose"

const Schema = mongoose.Schema

const Task = new Schema ({
    id: {type: Number, required: true},
    task: {type: String, required: true},
    status: {type: String, required: true},
    budget: {type: Number},
    dueDate: {type: Date},
    category: {type: String},
    createdBy: {
        type: Schema.Types.ObjectId, 
        ref: 'User', 
        required: true},
    deadline: {type: Date},
}, {
    timestamps: true
})

export default mongoose.model('Task', Task)