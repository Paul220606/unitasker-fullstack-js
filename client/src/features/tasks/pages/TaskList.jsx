import { useContext, useState, useMemo } from 'react'

import '../../../styles/task.scss'
import { Link } from 'react-router-dom'
import { AppContext } from '../../../app/App'
import NavTabsBar from '../../../shared/components/navsTabsBar'
import Table from '../../../shared/components/Table'
import FieldSortTitle from '../components/FieldSortTitle'
import StatsDisplay from '../../../shared/components/StatsDisplay'
import FormModal from '../../../shared/components/Form/FormModal'
import useFetchingData from '../../../shared/hooks/useFetchingData'

function TaskList() {
    const {user, loading, setLoading} = useContext(AppContext)
    const [tasks, setTasks] = useState([])
    const [stats, setStats] = useState([])
    const [modalState, setModalState] = useState({
        task: [],
        title: '',
        textMessage: ''
    })
    const [activeNav, setActiveNav] = useState({field: 'status', data: 'All Tasks'})
    const [sortedStats, setSortedStats] = useState({title: '#', order : 'asc'})
    const [searchTitle, setSearchTitle] = useState('')
    const filter = useMemo(() => ({
        sortTitle: sortedStats.title,
        sortOrder: sortedStats.order,
        [activeNav.field]: activeNav.data,
        searchTitle
    }), [activeNav, searchTitle, sortedStats])
    const loadData = useFetchingData(user, 'task', 'list', setLoading, [setTasks, setStats], filter)

    const tableTitle = 'Task List'
    let tableStats = [
        '#', 
        'Title', 
        'Description', 
        'Status', 
        'Category', 
        'Budget', 
        'Due Date'
    ]
    tableStats = tableStats.map((title)=> ['Status', 'Category'].includes(title) ? title : <FieldSortTitle 
                title={title} 
                sortedStats={sortedStats}
                setSortedStats={setSortedStats}
                {...title === '#'? {firstOrder : 'asc'}:{}}/>
            )
    const tableTasks = tasks.map(task=>({
        allStats: task,
        displayedStats: [task.id, task.title, task.description, task.status, task.category, task.budget||'0', task.dueDate],
    }))
    const buttonsData = [
        {type: 'light', content: <i className="bi bi-eye"></i>, modalTitle: 'View Task', modalMessage: ''},
        {type: 'light', content:  <i className="bi bi-pencil"></i>, modalTitle: 'Edit task', modalMessage: 'Edit'},
        {type: 'danger', content: <i className="bi bi-trash"></i>, modalTitle: 'Delete task', modalMessage: 'Confirm Delete'}
    ]
    const noDataMessage = <>
        {
            activeNav.data?
            <>
                There is no {activeNav.data.toLowerCase()} tasks created.
            </>
            :
            <>
                You have not created any task. Click <Link to='/tasks/new'>here</Link> to create one.
            </>
        }
    </>

    return (
        <div className="container-fluid p-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                    <h2 className="text-dark mb-1">My Tasks</h2>
                    <p className="text-secondary mb-0">Manage all your posted tasks</p>
                </div>
                <div className="d-flex gap-2">
                    <Link to="/tasks/new" className="btn btn-dark btn-lg">
                        <i className="bi bi-plus-circle me-2"></i>New Task
                    </Link>
                    <Link to="/tasks/bin" className="btn btn-dark btn-lg">
                        <i className="bi bi-trash me-2"></i>My Bin
                    </Link>
                </div>
            </div>

            <StatsDisplay stats={stats}/>

            <NavTabsBar activeNav={activeNav} setActiveNav={setActiveNav} fetchingFunction={loadData} setSearchTitle={setSearchTitle}/>
            
            <Table title={tableTitle} 
                stats={tableStats} 
                tasks={tableTasks}
                buttonsData={buttonsData}
                noDataMessage={noDataMessage}
                modalFunc={setModalState}/>
            
            <FormModal id="formModal" {...modalState} fetchingFunction={loadData}/>

        </div>
    )
}

export default TaskList