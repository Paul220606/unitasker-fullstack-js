import { useContext, useState, useMemo } from 'react'

import '../../../styles/task.scss'
import { Link } from 'react-router-dom'
import { Trans, useTranslation } from 'react-i18next'
import { AppContext } from '../../../app/App'
import NavTabsBar from '../../../shared/components/NavsTabsBar'
import Table from '../../../shared/components/Table'
import FieldSortTitle from '../components/FieldSortTitle'
import StatsDisplay from '../../../shared/components/StatsDisplay'
import FormModal from '../../../shared/components/Form/FormModal'
import useFetchingData from '../../../shared/hooks/useFetchingData'
import translateItem from '../../../shared/utils/translateItem'

function TaskList() {
    const {user, loading, setLoading} = useContext(AppContext)
    const [tasks, setTasks] = useState([])
    const [stats, setStats] = useState([])
    const {t, i18n} = useTranslation()
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

    const tableTitle = t('taskList.tableTitle')
    const tableFieldKeys = ['index', 'title', 'description', 'status', 'category', 'priority', 'budget', 'dueDate']
    // sortKey values are used as-is by the backend (Task.find().sort()) and must stay raw English
    const columnDefs = [
        {sortKey: '#', label: '#'},
        {sortKey: 'Title', label: t('taskList.columns.title')},
        {sortKey: 'Description', label: t('taskList.columns.description')},
        {sortKey: 'Status', label: t('taskList.columns.status')},
        {sortKey: 'Category', label: t('taskList.columns.category')},
        {sortKey: 'Priority', label: t('taskList.columns.priority')},
        {sortKey: 'Budget', label: t('taskList.columns.budget')},
        {sortKey: 'Due Date', label: t('taskList.columns.dueDate')}
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
        displayedStats: [task.id, task.title, task.description, task.status, task.category, task.priority || '-', task.budget||'0', task.dueDate],
    }))
    const buttonsData = [
        {type: 'light', content: <i className="bi bi-eye"></i>, modalTitle: 'View Task', modalMessage: ''},
        {type: 'light', content:  <i className="bi bi-pencil"></i>, modalTitle: 'Edit task', modalMessage: t('table.edit')},
        {type: 'danger', content: <i className="bi bi-trash"></i>, modalTitle: 'Delete task', modalMessage: t('table.confirmDelete')}
    ]
    const filteredStatusLabel = (() => {
        const label = translateItem(activeNav.data, activeNav.field, t)
        return i18n.language === 'en' ? label.toLowerCase() : label
    })()
    const noDataMessage = <>
        {
            (activeNav.data && activeNav.data!== 'All Tasks')?
            <>
                {t('taskList.noTaskFiltered', {status: filteredStatusLabel})}
            </>
            :
            <Trans i18nKey="taskList.noTaskWithLink" components={{ link: <Link to='/tasks/new' /> }} />
        }
    </>

    return (
        <div className="container-fluid p-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                    <h2 className="text-dark mb-1">{t('taskList.title')}</h2>
                    <p className="text-secondary mb-0">{t('taskList.subtitle')}</p>
                </div>
                <div className="d-flex gap-2">
                    <Link to="/tasks/new" className="btn btn-dark btn-lg">
                        <i className="bi bi-plus-circle me-2"></i>{t('taskList.newTask')}
                    </Link>
                    <Link to="/tasks/bin" className="btn btn-dark btn-lg">
                        <i className="bi bi-trash me-2"></i>{t('taskList.myBin')}
                    </Link>
                </div>
            </div>

            <StatsDisplay stats={stats}/>

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

export default TaskList
