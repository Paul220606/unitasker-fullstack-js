import { useContext, useState, useEffect } from 'react'

import '../../../styles/task.scss'
import { Link } from 'react-router-dom'
import { AppContext } from '../../../app/App'
import useFetchingData from '../../../shared/hooks/useFetchingData'

function TaskList() {
    const {user, loading, setLoading} = useContext(AppContext)
    const [tasks, setTasks] = useState([])
    const [stats, setStats] = useState([])
    const [activeNav, setActiveNav] = useState(0)
    const navItems = ['All Tasks', 'Pending', 'In Progress', 'Completed', 'Canceled']
    useFetchingData(user, 'task', 'list', setLoading, [setTasks, setStats], {status: navItems[activeNav]})

    return (
        <div className="container-fluid p-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                    <h2 className="text-dark mb-1">My Tasks</h2>
                    <p className="text-secondary mb-0">Manage all your posted tasks</p>
                </div>
                <Link to="/tasks/new" className="btn btn-dark btn-lg">
                    <i className="bi bi-plus-circle me-2"></i>New Task
                </Link>
            </div>

            <div className="row g-3 mb-4">
                {stats.map((stat, index) => (
                    <div className="col-md-3" key={index}>
                        <div className="card bg-dark text-light shadow-sm p-3">
                            <div className="d-flex justify-content-between align-items-center">
                                <div>
                                    <h6 className="text-light mb-1">{stat.title}</h6>
                                    <h3 className="fw-bold mb-0">{stat.value}</h3>
                                </div>
                                <i className={`bi ${stat.icon} fs-1 opacity-50`}></i>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="card bg-dark text-light shadow-sm mb-3">
                <div className="card-header border-0">
                <div className="d-flex justify-content-between align-items-center">
                    <ul className="nav nav-pills">
                        {navItems.map((item, index)=> {
                            return <li key={index} className="nav-item">
                                <button className={"nav-link "+ (index===activeNav?'active':'text-light')}
                                onClick={()=>{setActiveNav(index)}}>
                                    {item}
                                </button>
                            </li>
                        })}
                    </ul>
                    <form className="d-flex ms-auto" role="search">
                        <input className="form-control form-control-sm bg-secondary text-light border-0 me-2" type="search" placeholder="Search tasks..." aria-label="Search"/>
                        <button className="btn btn-sm btn-light" type="submit">Search</button>
                    </form>
                </div>
                </div>
            </div>

            <div className="card bg-dark text-light shadow-sm">
                <div className="card-body p-0">
                    <table className="table table-dark table-hover mb-0">
                        <thead>
                            <tr>
                                <th></th>
                                <th>#</th>
                                <th>Task</th>
                                <th>Description</th>
                                <th>Status</th>
                                <th>Category</th>
                                <th>Budget</th>
                                <th>Due Date</th>
                                <th>Created</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {tasks.length > 0 ?
                            tasks.map(task => (
                                <tr key={task.id}>
                                    <td></td>
                                    <td>{task.id}</td>
                                    <td className="fw-semibold">{task.title}</td>
                                    <td>
                                        <span className="text-truncate d-inline-block" style={{maxWidth: '200px'}}>
                                            {task.description}
                                        </span>
                                    </td>
                                    <td>
                                        <span className={`badge ${
                                            task.status === "Completed" ? "bg-success" : 
                                            task.status === "Pending" ? "bg-warning" : 
                                            task.status === "Canceled" ? "bg-danger" : 
                                            "bg-primary"
                                        }`}>
                                            {task.status}
                                        </span>
                                    </td>
                                    <td>{task.category}</td>
                                    <td>${task.budget}</td>
                                    <td>{task.dueDate}</td>
                                    <td>{task.createdAt}</td>
                                    <td>
                                        <div className="btn-group btn-group-sm">
                                            <button className="btn btn-outline-light">
                                                <i className="bi bi-eye"></i>
                                            </button>
                                            <button className="btn btn-outline-light">
                                                <i className="bi bi-pencil"></i>
                                            </button>
                                            <button className="btn btn-outline-danger">
                                                <i className="bi bi-trash"></i>
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            )):
                            <tr className='p-4'> 
                            <td colSpan={10}>
                                You have not created any task. Click <Link to='/tasks/new'>here</Link> to create one.
                            </td>
                            </tr>}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}

export default TaskList