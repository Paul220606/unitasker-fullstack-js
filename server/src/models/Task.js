import mongoose from "mongoose"
import mongooseDelete from "mongoose-delete"

const Schema = mongoose.Schema

const Task = new Schema ({
    taskNumber: {type: Number, required: true},
    title: {type: String, required: true},
    description: {type:String},
    status: {type: String},
    budget: {type: Number},
    dueDate: {type: Date},
    category: {type: String},
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
}, {
    timestamps: true
})

Task.plugin(mongooseDelete, { 
    deletedAt : true,
    overrideMethods: true,
})

export default mongoose.model('Task', Task)