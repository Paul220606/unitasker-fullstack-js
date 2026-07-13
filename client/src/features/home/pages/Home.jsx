import { useContext, useState} from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Trans, useTranslation } from 'react-i18next'

import '../../../styles/home.scss'
import CompactBanner from '../components/CompactBanner.jsx'
import StatsDisplay from '../../../shared/components/StatsDisplay.jsx'
import Table from '../../../shared/components/Table.jsx'
import FormModal from '../../../shared/components/Form/FormModal.jsx'
import useFetchingData from '../../../shared/hooks/useFetchingData'
import { AppContext } from '../../../app/App'

function Home() {
    const {user, loading, setLoading} = useContext(AppContext)
    const [recentTasks, setRecentTasks] = useState([])
    const [stats, setStats] = useState([])
    const {t} = useTranslation()

    const navigate = useNavigate()
    const [modalTask, setModalState] = useState({
        task: [],
        title: '',
        textMessage: ''
    })

    const tableTitle = t('home.recentTasks')
    const tableStats = ['#', t('task.title'), t('task.status'), t('task.priority'), t('task.dueDate')]
    const tableFieldKeys = ['#', 'title', 'status', 'priority', 'dueDate']
    const tableTasks = recentTasks.map(task=>({
        allStats: task,
        displayedStats: [task.id, task.title, task.status, task.priority || '-', task.dueDate],
    }))
    const buttonsData = [
        {type: 'light', content: <i className="bi bi-eye"></i>, modalTitle: 'View Task', modalMessage: ''},
        {type: 'light', content: <i className="bi bi-pencil-square"></i>, modalTitle: 'Quick Update', modalMessage: t('common.update')}
    ]
    const noDataMessage = <Trans i18nKey="home.noTaskWithLink" components={{ link: <Link to='/tasks/new' /> }} />

    
    const loadData = useFetchingData(user, 'home', 'render', setLoading, [setRecentTasks, setStats], {})

    return (
        user? 
        /* With Login */
        <>
            <div className="container-fluid p-4">
                <div className="text-dark mb-4">
                    <h2>{t('home.welcome', {name: user})}</h2>
                    <p className="text-secondary">{t('home.subtitle')}</p>
                </div>

                <StatsDisplay stats={stats}/>
                
                <Table title={tableTitle} 
                stats={tableStats} 
                fieldKeys={tableFieldKeys}
                tasks={tableTasks}
                buttonsData={buttonsData}
                noDataMessage={noDataMessage}
                modalFunc={setModalState}/>

                <div className="d-flex gap-3 mb-5">
                    <button className="btn btn-dark btn-lg" onClick={()=>{navigate('/tasks/new')}}>{t('home.postTask')}</button>
                    <button className="btn btn-dark btn-lg" onClick={()=> {navigate('/profile')}}>{t('home.viewProfile')}</button>
                </div>
            </div>
            <FormModal id="formModal" {...modalTask} fetchingFunction={loadData}/>
            <CompactBanner tasks={recentTasks.filter(task => task.status !== 'Completed' && task.status !== 'Canceled')}/>
        </> :

        /* Without Login */
        <>
        <section className="bg-dark bg-opacity-75 text-light py-5 text-center">
            <div className="container">
            <h1 className="fw-bold display-5 mb-3 fade-in">
                {t('home.hero.title')}
            </h1>
            <p className="lead text-light mb-4 fade-in delay-1" onClick={()=>{navigate('/info')}}>
                {t('home.hero.subtitle')}
            </p>
            <div className="d-flex justify-content-center gap-3 fade-in delay-2">
                <button className="btn btn-primary btn-lg" onClick={()=>{navigate('/register')}}>
                {t('home.hero.getStarted')}
                </button>
                <button className="btn btn-outline-light btn-lg" onClick={()=>{navigate('/about')}}>
                {t('home.hero.learnMore')}
                </button>
            </div>
            </div>
        </section>

        <section className="py-5 bg-light">
            <div className="container">
            <div className="text-center mb-5">
                <h2 className="fw-bold">{t('home.why.title')}</h2>
                <p className="text-muted">
                {t('home.why.subtitle')}
                </p>
            </div>

            <div className="row g-4">
                <div className="col-md-4">
                <div className="card h-100 p-4 feature-card">
                    <h5 className="fw-semibold">{t('home.why.feature1Title')}</h5>
                    <p className="text-muted">
                    {t('home.why.feature1Desc')}
                    </p>
                </div>
                </div>

                <div className="col-md-4">
                <div className="card h-100 p-4 feature-card">
                    <h5 className="fw-semibold">{t('home.why.feature2Title')}</h5>
                    <p className="text-muted">
                    {t('home.why.feature2Desc')}
                    </p>
                </div>
                </div>

                <div className="col-md-4">
                <div className="card h-100 p-4 feature-card">
                    <h5 className="fw-semibold">{t('home.why.feature3Title')}</h5>
                    <p className="text-muted">
                    {t('home.why.feature3Desc')}
                    </p>
                </div>
                </div>
            </div>
            </div>
        </section>

        <section className="py-5 bg-body-secondary">
            <div className="container">
            <div className="text-center mb-5">
                <h2 className="fw-bold">{t('home.howItWorks.title')}</h2>
            </div>

            <div className="row g-4 text-center">
                <div className="col-md-4">
                <div className="step-number">1</div>
                <h6 className="fw-semibold">{t('home.howItWorks.step1Title')}</h6>
                <p className="text-muted">
                    {t('home.howItWorks.step1Desc')}
                </p>
                </div>

                <div className="col-md-4">
                <div className="step-number">2</div>
                <h6 className="fw-semibold">{t('home.howItWorks.step2Title')}</h6>
                <p className="text-muted">
                    {t('home.howItWorks.step2Desc')}
                </p>
                </div>

                <div className="col-md-4">
                <div className="step-number">3</div>
                <h6 className="fw-semibold">{t('home.howItWorks.step3Title')}</h6>
                <p className="text-muted">
                    {t('home.howItWorks.step3Desc')}
                </p>
                </div>
            </div>
            </div>
        </section>

        <section className="py-5 bg-dark bg-opacity-75 text-light text-center">
            <div className="container">
            <h2 className="fw-bold mb-3">
                {t('home.cta.title')}
            </h2>
            <p className="mb-4">
                {t('home.cta.subtitle')}
            </p>
            <button className="btn btn-success btn-lg" onClick={()=>{window.location.href='/register'}}>
                {t('home.cta.signUpFree')}
            </button>
            </div>
        </section>
        </>
    )
}

export default Home
