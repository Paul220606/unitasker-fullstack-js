import Task from '../models/Task.js'
import Counter from '../models/Counter.js'
import { checkDataNull } from "../helpers/checkNull.js"

class TaskController {
    async create(req, res) {
        let {status, ...data} = checkDataNull({...req.body})
        const userId = req.user.id
        try {
            const counter = await Counter.findOneAndUpdate(
                {userId},
                {$inc: {postedTasks: 1, pendingTasks: status?0:1}},
                {
                    new: true,
                    upsert: true,
                    runValidators: true
                }
            )
            status = status? 'In Progress' : 'Pending'
            data =  {...data, userId, taskNumber: counter.postedTasks, status}
            const task = new Task(data)
            await task.save()
            return res.status(201).json({
                success: true,
                state: 'Task is created',
                message: 'You can now view it in your recent tasks.'
            })
        } catch (err){
            console.log(err)
            return res.status(500).json({
                success: false,
                state: 'Task is not created',
                message: ''
            })
        }
    }

    async list(req, res){
        const status = req.query.status
        const userId = req.user.id
        try {
            const checkFields = status === 'All Tasks'? {userId}: {userId, status}
            const taskData = await Task.find(checkFields).limit(30)
            const counter = await Counter.findOne({userId})
            const tasks = taskData.map((task)=>{return {
                id: task.taskNumber,
                title: task.title,
                description: task.description,
                status: task.status,
                category: task.category,
                budget: task.budget,
                dueDate: task.dueDate? task.dueDate.toLocaleString('en-GB'): 'None'
            }})
            const stats = [
                {title: 'Posted Tasks', value: counter.postedTasks || '0', icon: 'bi bi-list-task'},
                {title: 'Pending Tasks', value: counter.pendingTasks || '0', icon: 'bi-hourglass-split'},
                {title: 'Completed Tasks', value: counter.completedTasks || '0', icon: 'bi-check-circle'},
                {title: 'Canceled Tasks', value: counter.canceledTasks || '0', icon: 'bi bi-x-circle'}
            ]
            return res.status(201).json({tasks, stats})
        } catch (err) {
            console.log(err)
            return res.status(402)
        }
    }
}

const taskController = new TaskController
export default taskController