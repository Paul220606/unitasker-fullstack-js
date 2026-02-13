import Task from "../models/Task.js"
import Counter from "../models/Counter.js"

class SiteController {
    async homeRender (req, res) {
        const userId = req.user.id
        try {
            const tasks = await Task.find({userId}).limit(5)
            const recentTasks = tasks.map((task)=>{return {
                id: task.taskNumber,
                title: task.title,
                description: task.description,
                status: task.status,
                category: task.category,
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
}

const siteController = new SiteController
export default siteController