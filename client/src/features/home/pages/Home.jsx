import { useContext } from 'react'

import '../../../styles/home.scss'
import { AppContext } from '../../../app/App'

function Home() {
    // These are sample stats just for checking UI before rending from backend
    const stats = [
        { title: "Tasks Posted", value: 12 },
        { title: "Tasks Completed", value: 8 },
        { title: "Earnings ($)", value: 240 },
        { title: "Pending Tasks", value: 2 },
    ]
    const recentTasks = [
        { id: 1, title: "Deliver documents", status: "Completed", date: "2026-02-01" },
        { id: 2, title: "Pick up groceries", status: "In Progress", date: "2026-02-02" },
        { id: 3, title: "Design logo", status: "Pending", date: "2026-02-03" },
        { id: 4, title: "Set up website", status: "Completed", date: "2026-01-30" },
    ]

    const {user} = useContext(AppContext)
    return (
        user? 
        /* With Login */
        <>
            <div className="container-fluid p-4">
                <div className="text-dark mb-4">
                    <h2>Welcome back, {user}!</h2>
                    <p className="text-secondary">Here's a quick overview of your Unitasker activity</p>
                </div>

                <div className="row g-3 mb-5">
                    {stats.map((stat, index) => (
                        <div className="col-md-3" key={index}>
                            <div className="card bg-dark text-light shadow-sm p-3">
                                <h6 className="text-light">{stat.title}</h6>
                                <h3 className="fw-bold">{stat.value}</h3>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="card bg-dark text-light shadow-sm mb-5">
                    <div className="card-header">
                        <h5 className="mb-0">Recent Tasks</h5>
                    </div>
                    <div className="card-body p-0">
                        <table className="table table-dark table-hover mb-0">
                            <thead>
                                <tr>
                                    <th></th>
                                    <th>#</th>
                                    <th>Task</th>
                                    <th>Status</th>
                                    <th>Date</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                            {recentTasks.map(task => (
                                <tr key={task.id}>
                                    <td></td>
                                    <td>{task.id}</td>
                                    <td>{task.title}</td>
                                    <td>
                                    <span className={`badge ${task.status === "Completed" ? "bg-success" : task.status === "Pending" ? "bg-warning text-dark" : "bg-primary"}`}>
                                    {task.status}
                                    </span>
                                    </td>
                                    <td>{task.date}</td>
                                    <td>
                                    <button className="btn btn-sm btn-outline-light">View</button>
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                <div className="d-flex gap-3 mb-5">
                    <button className="btn btn-dark btn-lg" onClick={()=>{window.location.href='/tasks/new'}}>Post New Task</button>
                    <button className="btn btn-dark btn-lg">View Profile</button>
                </div>
            </div>
        </> :

        /* Without Login */
        <>
        <section className="bg-dark bg-opacity-75 text-light py-5 text-center">
            <div className="container">
            <h1 className="fw-bold display-5 mb-3 fade-in">
                Get Things Done with Unitasker
            </h1>
            <p className="lead text-light mb-4 fade-in delay-1" onClick={()=>{window.location.href='/info'}}>
                A simple way to post small tasks and get real help.
            </p>
            <div className="d-flex justify-content-center gap-3 fade-in delay-2">
                <button className="btn btn-primary btn-lg" onClick={()=>{window.location.href='/register'}}>
                Get Started
                </button>
                <button className="btn btn-outline-light btn-lg" onClick={()=>{window.location.href='/about'}}>
                Learn More
                </button>
            </div>
            </div>
        </section>

        <section className="py-5 bg-light">
            <div className="container">
            <div className="text-center mb-5">
                <h2 className="fw-bold">Why Unitasker?</h2>
                <p className="text-muted">
                Simple · Flexible · Transparent
                </p>
            </div>

            <div className="row g-4">
                <div className="col-md-4">
                <div className="card h-100 p-4 feature-card">
                    <h5 className="fw-semibold">⚡ Post Tasks Fast</h5>
                    <p className="text-muted">
                    Create a task in minutes with clear requirements.
                    </p>
                </div>
                </div>

                <div className="col-md-4">
                <div className="card h-100 p-4 feature-card">
                    <h5 className="fw-semibold">🤝 Find the Right Help</h5>
                    <p className="text-muted">
                    Choose workers based on skills and budget.
                    </p>
                </div>
                </div>

                <div className="col-md-4">
                <div className="card h-100 p-4 feature-card">
                    <h5 className="fw-semibold">💳 Pay Securely</h5>
                    <p className="text-muted">
                    Release payment only after the task is completed.
                    </p>
                </div>
                </div>
            </div>
            </div>
        </section>

        <section className="py-5 bg-body-secondary">
            <div className="container">
            <div className="text-center mb-5">
                <h2 className="fw-bold">How It Works</h2>
            </div>

            <div className="row g-4 text-center">
                <div className="col-md-4">
                <div className="step-number">1</div>
                <h6 className="fw-semibold">Post a Task</h6>
                <p className="text-muted">
                    Describe what you need done
                </p>
                </div>

                <div className="col-md-4">
                <div className="step-number">2</div>
                <h6 className="fw-semibold">Receive Offers</h6>
                <p className="text-muted">
                    Review and select the best match
                </p>
                </div>

                <div className="col-md-4">
                <div className="step-number">3</div>
                <h6 className="fw-semibold">Complete & Review</h6>
                <p className="text-muted">
                    Pay securely and leave feedback
                </p>
                </div>
            </div>
            </div>
        </section>

        <section className="py-5 bg-dark bg-opacity-75 text-light text-center">
            <div className="container">
            <h2 className="fw-bold mb-3">
                Ready to get started?
            </h2>
            <p className="mb-4">
                Join Unitasker and start posting tasks today.
            </p>
            <button className="btn btn-success btn-lg" onClick={()=>{window.location.href='/register'}}>
                Sign Up for Free
            </button>
            </div>
        </section>
        </>
    )
}

export default Home
