import Task from "../models/Task.js"
import User from "../models/User.js"
import Counter from "../models/Counter.js"

class SiteController {
    async homeRender (req, res) {
        const userId = req.user.id
        try {
            let tasks = await Task.find({userId, dueDate: {$ne: null}, status: {$nin: ['Completed', 'Canceled']}}).sort({dueDate: 1}).limit(5)
            if (tasks.length <5){
                let alreadyGot = tasks.map((task)=>task._id)
                let extTasks = await Task.find({userId, _id: {$nin: alreadyGot}, status: {$nin: ['Completed', 'Canceled']}}).limit(5 - tasks.length)
                tasks = [...tasks, ...extTasks]
                if (tasks.length < 5) {
                    alreadyGot = tasks.map((task)=>task._id)
                    extTasks = await Task.find({userId, _id: {$nin: alreadyGot}}).limit(5-tasks.length)
                    tasks = [...tasks, ...extTasks]
                }
            }
            const recentTasks = tasks.map((task)=>{return {
                id: task.taskNumber,
                title: task.title,
                description: task.description,
                status: task.status,
                category: task.category,
                priority: task.priority || null,
                budget: task.budget,
                dueDate: task.dueDate? task.dueDate.toLocaleString('en-GB'): 'None'
            }})
            const counter = await Counter.findOne({userId})
            let stats
            if (counter){
                stats = [
                {title: 'All Tasks', value: counter.allTasks, icon: 'bi bi-list-task'},
                {title: 'In Progress Tasks', value: (counter.tasks - counter.pendingTasks - counter.completedTasks- counter.canceledTasks), icon: 'bi-hourglass-split'},
                {title: 'Deleted Tasks', value: counter.deletedTasks, icon: 'bi-check-circle'},
                {title: 'Earning', value: 0, icon: 'bi bi-coin'}
                ] 
            } else {
                stats = [
                    {title: 'All Tasks', value: 0, icon: 'bi bi-list-task'},
                    {title: 'In Progress Tasks', value: 0, icon: 'bi-hourglass-split'},
                    {title: 'Deleted Tasks', value: 0, icon: 'bi bi-trash'},
                    {title: 'Earning', value: 0, icon: ' bi bi-coin'}
                ]
            }
            
            return res.status(201).json({recentTasks, stats})
        } catch (err) {
            console.log(err)
            return res.status(402)
        }
    }
    async profileRender (req, res) {
        const _id = req.user.id
        try {
            let user = await User.findOne({_id})
            const profileData = {
                fullName: user.fullName,
                username: user.username,
                email: user.email,
                phone: user.phone,
                imageUrl: user.imageUrl,
                location: user.location,
                categories: user.categories,
                joinedDate: user.createdAt.toLocaleDateString('en-GB', {
                    month: 'short',
                    day: '2-digit',
                    year: 'numeric'
                }).replace(',', ''),
            }
            let counter = await Counter.findOne({userId: _id})
            const counterData = {
                tasks: counter?.tasks || 0,
                completed: counter?.completedTasks || 0,
                ratings: '5.0',
            }
            return res.status(201).json({profileData, counterData})
        } catch (err) {
            console.log(err)
            return res.status(402)
        }
    }
}

const siteController = new SiteController
export default siteController