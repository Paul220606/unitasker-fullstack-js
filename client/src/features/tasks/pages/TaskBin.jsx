import { useContext, useState, useMemo } from 'react'
import '../../../styles/task.scss'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { AppContext } from '../../../app/App'
import FieldSortTitle from '../components/FieldSortTitle'
import NavTabsBar from '../../../shared/components/NavsTabsBar'
import Table from '../../../shared/components/Table'
import FormModal from '../../../shared/components/Form/FormModal'
import useFetchingData from '../../../shared/hooks/useFetchingData'

function TaskBin() {
    const {user, loading, setLoading} = useContext(AppContext)
    const [tasks, setTasks] = useState([])
    const {t} = useTranslation()
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
    const tableTitle = t('taskBin.tableTitle')
    const tableFieldKeys = ['index', 'title', 'description', 'status', 'category', 'budget', 'deletedAt']
    // sortKey values are used as-is by the backend (Task.findDeleted().sort()) and must stay raw English
    const columnDefs = [
        {sortKey: '#', label: '#'},
        {sortKey: 'Title', label: t('taskBin.columns.title')},
        {sortKey: 'Description', label: t('taskBin.columns.description')},
        {sortKey: 'Status', label: t('taskBin.columns.status')},
        {sortKey: 'Category', label: t('taskBin.columns.category')},
        {sortKey: 'Budget', label: t('taskBin.columns.budget')},
        {sortKey: 'Deleted At', label: t('taskBin.columns.deletedAt')}
    ]
    const tableStats = columnDefs.map(({sortKey, label})=> ['Status', 'Category', 'Priority'].includes(sortKey) ? label : <FieldSortTitle 
        key={sortKey}
        sortKey={sortKey}
        label={label}
        sortedStats={sortedStats}
        setSortedStats={setSortedStats}
        {...sortKey === '#'? {firstOrder : 'asc'}:{}}/>
    )
    const tableTasks = tasks.map(task=>({
        allStats: task,
        displayedStats: [task.id, task.title, task.description, task.status, task.category, task.budget, task.deletedAt],
    }))
    const buttonsData = [
        {type: 'light', content: <i className="bi bi-eye"></i>, modalTitle: 'View Task', modalMessage: ''},
        {type: 'success', content: <i className="bi bi-arrow-counterclockwise"></i>, modalTitle: 'Restore task', modalMessage: t('table.restore')},
        {type: 'danger', content: <i className="bi bi-trash"></i>, modalTitle: 'Delete permanently', modalMessage: t('table.confirmDelete')}
    ]
    const noDataMessage = t('taskBin.binEmpty')
    const loadData = useFetchingData(user, 'task', 'bin', setLoading, [setTasks], filter)

    return (
        <div className="container-fluid p-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                    <h2 className="text-dark mb-1">{t('taskBin.title')}</h2>
                    <p className="text-secondary mb-0">{t('taskBin.subtitle')}</p>
                </div>
                <Link to="/tasks" className="btn btn-dark">
                    {t('taskBin.backToTasks')}
                </Link>
            </div>

            <NavTabsBar activeNav={activeNav} setActiveNav={setActiveNav} fetchingFunction={loadData} setSearchTitle={setSearchTitle}/>

            <Table title={tableTitle} 
                stats={tableStats} 
                fieldKeys={tableFieldKeys}
                tasks={tableTasks}
                buttonsData={buttonsData}
                noDataMessage={noDataMessage}
                modalFunc={setModalState}/>
            

            <FormModal id="formModal" {...modalState} fetchingFunction={loadData}/>
        </div>
    )
}

export default TaskBin
