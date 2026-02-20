import { useContext, useState, useMemo } from 'react'
import '../../../styles/task.scss'
import { Link } from 'react-router-dom'
import { AppContext } from '../../../app/App'
import FieldSortTitle from '../components/FieldSortTitle'
import NavTabsBar from '../../../shared/components/navsTabsBar'
import Table from '../../../shared/components/Table'
import FormModal from '../../../shared/components/Form/FormModal'
import useFetchingData from '../../../shared/hooks/useFetchingData'

function TaskBin() {
    const {user, loading, setLoading} = useContext(AppContext)
    const [tasks, setTasks] = useState([])
    const [sortedStats, setSortedStats] = useState({title: '#', order : 'asc'})
    const [modalState, setModalState] = useState({
        task: [],
        title: '',
        textMessage: ''
    })
    const [activeNav, setActiveNav] = useState({field: 'status', data: 'All Tasks'})
    const [searchTitle, setSearchTitle] = useState('')
    const filter = useMemo(() => ({
        sortTitle: sortedStats.title,
        sortOrder: sortedStats.order,
        [activeNav.field]: activeNav.data,
        searchTitle
    }), [activeNav, searchTitle, sortedStats])
    const tableTitle = 'Deleted tasks'
    let tableStats = ['#', 'Title', 'Description', 'Status', 'Category', 'Budget', 'Deleted At']
    tableStats = tableStats.map((title)=> ['Status', 'Category'].includes(title) ? title : <FieldSortTitle 
        title={title} 
        sortedStats={sortedStats}
        setSortedStats={setSortedStats}
        {...title === '#'? {firstOrder : 'asc'}:{}}/>
    )
    const tableTasks = tasks.map(task=>({
        allStats: task,
        displayedStats: [task.id, task.title, task.description, task.status, task.category, task.budget, task.deletedAt],
    }))
    const buttonsData = [
        {type: 'light', content: <i className="bi bi-eye"></i>, modalTitle: 'View Task', modalMessage: ''},
        {type: 'success', content: <i className="bi bi-arrow-counterclockwise"></i>, modalTitle: 'Restore task', modalMessage: 'Restore'},
        {type: 'danger', content: <i className="bi bi-trash"></i>, modalTitle: 'Delete permanently', modalMessage: 'Confirm Delete'}
    ]
    const noDataMessage = 'Task bin is empty!'
    const loadData = useFetchingData(user, 'task', 'bin', setLoading, [setTasks], filter)

    return (
        <div className="container-fluid p-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                    <h2 className="text-dark mb-1">My Bin</h2>
                    <p className="text-secondary mb-0">Deleted tasks</p>
                </div>
                <Link to="/tasks" className="btn btn-dark">
                    Back to tasks
                </Link>
            </div>

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

export default TaskBin
