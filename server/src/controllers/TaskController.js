import Fuse from 'fuse.js'

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
                {$inc: {allTasks: 1, tasks: 1, pendingTasks: status?0:1}},
                {
                    new: true,
                    upsert: true,
                    runValidators: true
                }
            )
            status = status? 'In Progress' : 'Pending'
            data =  {...data, userId, taskNumber: counter.allTasks, status}
            const task = new Task(data)
            await task.save()
            return res.status(201).json({
                success: true,
                state: 'Task is created',
                message: 'You can now view it in your home page or task list.'
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
        const {searchTitle, status} = req.query
        const userId = req.user.id
        try {
            const checkFields = status === 'All Tasks'? {userId}: {userId, status}
            let taskData = await Task.find(checkFields).limit(30)
            if (searchTitle){
                const fuse = new Fuse(taskData, {keys: ["title"], threshold: 0.5})
                taskData = fuse.search(searchTitle).map(r => r.item)
            }
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
            let stats 
            if (counter){
                stats = [
                {title: 'Current Tasks', value: counter.tasks, icon: 'bi bi-list-task'},
                {title: 'Pending Tasks', value: counter.pendingTasks || '0', icon: 'bi-hourglass-split'},
                {title: 'Completed Tasks', value: counter.completedTasks || '0', icon: 'bi-check-circle'},
                {title: 'Canceled Tasks', value: counter.canceledTasks || '0', icon: 'bi bi-x-circle'}
            ]
            } else {
                stats = [
                    {title: 'Current Tasks', value: 0, icon: 'bi bi-list'},
                    {title: 'Pending Tasks', value: 0, icon: 'bi bi-hourglass-top'},
                    {title: 'Completed Tasks', value: 0, icon: 'bi-check-circle'},
                    {title: 'Canceled Tasks', value: 0, icon: ' bi bi-x-circle'}
                ]
            }
            return res.status(201).json({tasks, stats})
        } catch (err) {
            console.log(err)
            return res.status(500)
        }
    }

    async listDeleted(req, res){
        const {searchTitle, status} = req.query
        const userId = req.user.id
        try {
            const checkFields = status === 'All Tasks'? {userId}: {userId, status}
            let taskData = await Task.findDeleted(checkFields).limit(30)
            if (searchTitle){
                const fuse = new Fuse(taskData, {keys: ["title"], threshold: 0.5})
                taskData = fuse.search(searchTitle).map(r => r.item)
            }
            const tasks = taskData.map((task)=>{return {
                id: task.taskNumber,
                title: task.title,
                description: task.description,
                status: task.status,
                category: task.category,
                budget: task.budget,
                dueDate: task.dueDate? task.dueDate.toLocaleString('en-GB'): 'None',
                deletedAt: task.deletedAt.toLocaleString('en-GB')
            }})
            return res.status(201).json({tasks})
        }
        catch (err){
            console.log(err)
            return res.status(500)
        }
    }

    async edit (req, res) {
        const {taskNumber, ...data} = checkDataNull({...req.body})
        const userId = req.user.id
        try {
            const oldTask = await Task.findOne({userId, taskNumber})
            if (!oldTask) {
                return res.status(404).json({
                    success: false,
                    state: 'Task is not editted',
                    message: 'There is no task with that id.'
                })
            }
            if (oldTask.status !== data.status){
                await Counter.findOneAndUpdate({userId}, {$inc: {
                    ...oldTask.status!=='In Progress'?{[`${oldTask.status.toLowerCase()}Tasks`]: -1}:{}, 
                    ...data.status!=='In Progress'?{[`${data.status.toLowerCase()}Tasks`]: 1}:{},
                }})
            }
            await Task.findOneAndUpdate({userId, taskNumber}, data, {new: true})
            return res.status(201).json({
                success: true,
                state: 'Task is edited',
                message: 'You can now view it in your home page or task list.'
            })
        } catch (err) {
            console.log(err)
            return res.status(500).json({
                success: false,
                state: 'Task is not editted',
                message: ''
            })
        }
    }

    async restore (req, res) {
        const {taskNumber, status} = req.body
        const userId = req.user.id
        try {
            const isRestored = await Task.restore({userId, taskNumber})
            console.log(isRestored)
            if (isRestored.modifiedCount === 1) {
                await Counter.findOneAndUpdate({userId}, {
                    $inc: {
                        tasks: 1,
                        deletedTasks: -1,
                        ...status!=='In Progress'?{[`${status.toLowerCase()}Tasks`]: 1}:{},
                    }
                })
            }
            return res.status(201).json({
                success: true,
                state: 'Task has been restored',
                message: 'The data has been reloaded.',
            })
        } catch (err) {
            return res.status(500).json({
                success: false,
                state: 'Task has not been restored',
                message: ''
            })
        }
    }

    async softDelete (req, res) {
        const {taskNumber, status} = req.body
        const userId = req.user.id
        try {
            const isDeleted = await Task.delete({taskNumber, userId})
            if (isDeleted.modifiedCount === 1) {
                await Counter.findOneAndUpdate({userId}, {
                    $inc: {
                        tasks: -1,
                        deletedTasks: 1,
                        ...status!=='In Progress'?{[`${status.toLowerCase()}Tasks`]: -1}:{},
                    }
                })
            }
            return res.status(201).json({
                success: true,
                state: 'Task has been deleted',
                message: 'The data has been reloaded.'
            })
        }catch (err) {
            return res.status(500).json({
                success: false,
                state: 'Task has not been deleted',
                message: ''
            })
        }
    }

    async delete (req, res) {
        const {taskNumber} = req.body
        const userId = req.user.id
        try {
            const isDeleted = await Task.deleteOne({taskNumber, userId})
            if (isDeleted.deletedCount === 1) {
                await Task.updateManyWithDeleted({userId, taskNumber: {$gt: taskNumber}}, {
                    $inc: {taskNumber: -1}
                })
                await Counter.findOneAndUpdate({userId}, {
                    $inc: {
                        allTasks: -1,
                        deletedTasks: -1,
                    }
                })
            }
            return res.status(201).json({
                success: true,
                state: 'Task has been deleted permanently',
                message: 'You now can not view this task anymore.'
            })
        } catch (err) {
            return res.status(500).json({
                success: false,
                state: 'Task has not been deleted',
                message: ''
            })
        }
    }
}

const taskController = new TaskController
export default taskController