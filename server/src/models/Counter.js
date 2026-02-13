import mongoose from "mongoose"

const Counter = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        unique: true
    },
    allTasks: {type: Number, default: 0},
    tasks: {type: Number, default: 0},
    completedTasks: {type: Number, default: 0},
    pendingTasks: {type: Number, default: 0},
    canceledTasks: {type: Number, default: 0},
    deletedTasks: {type: Number, default: 0}
})

export default mongoose.model('Counter', Counter)