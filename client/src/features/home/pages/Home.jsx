import { useContext, useState} from 'react'
import { Link } from 'react-router-dom'

import '../../../styles/home.scss'
import StatsDisplay from '../../../shared/components/StatsDisplay.jsx'
import Table from '../../../shared/components/Table.jsx'
import FormModal from '../../../shared/components/Form/FormModal.jsx'
import useFetchingData from '../../../shared/hooks/useFetchingData'
import { AppContext } from '../../../app/App'

function Home() {
    const {user, loading, setLoading} = useContext(AppContext)
    const [recentTasks, setRecentTasks] = useState([])
    const [stats, setStats] = useState([])
    const [modalTask, setModalState] = useState({
        task: [],
        title: '',
        textMessage: ''
    })

    const tableTitle = 'Recent Tasks'
    const tableStats = ['Task', 'Status', 'Due Date']
    const tableTasks = recentTasks.map(task=>({
        allStats: task,
        displayedStats: [task.id, task.title, task.status, task.dueDate],
    }))
    const buttonsData = [{type: 'light', content: 'View', modalTitle: 'View Task', modalMessage: ''}]
    const noDataMessage = <>
        You have not created any task. Click <Link to='/tasks/new'>here</Link> to create one.
    </>
    useFetchingData(user, 'home', 'render', setLoading, [setRecentTasks, setStats])

    return (
        user? 
        /* With Login */
        <>
            <div className="container-fluid p-4">
                <div className="text-dark mb-4">
                    <h2>Welcome back, {user}!</h2>
                    <p className="text-secondary">Here's a quick overview of your Unitasker activity</p>
                </div>

                <StatsDisplay stats={stats}/>
                
                <Table title={tableTitle} 
                stats={tableStats} 
                tasks={tableTasks}
                buttonsData={buttonsData}
                noDataMessage={noDataMessage}
                modalFunc={setModalState}/>

                <div className="d-flex gap-3 mb-5">
                    <button className="btn btn-dark btn-lg" onClick={()=>{window.location.href='/tasks/new'}}>Post New Task</button>
                    <button className="btn btn-dark btn-lg">View Profile</button>
                </div>
            </div>
            <FormModal id="formModal" {...modalTask} title='View task'/>
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
