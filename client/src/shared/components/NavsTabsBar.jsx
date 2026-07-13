import { useState, useEffect, useContext } from "react"
import { useTranslation } from "react-i18next"

import { AppContext } from "../../app/App"
import translateItem from "../utils/translateItem"

function NavTabsBar({activeNav, setActiveNav, fetchingFunction, setSearchTitle}) {
    const {categoriesList} = useContext(AppContext)
    const [searchText, setSearchText] = useState('')
    const [viewMode, setViewMode] = useState('status')
    const {t} = useTranslation()

    const statusItems = ['All Tasks', 'Pending', 'In Progress', 'Completed', 'Canceled'] 
    const priorityItems = ['All Tasks', 'High', 'Medium', 'Low']
    const categoryItems = ['All Tasks', ...categoriesList? categoriesList.split(', '): []]
    const navItems = viewMode === 'status' ? statusItems : viewMode === 'category' ? categoryItems : priorityItems
    const field = viewMode === 'status' ? 'status' : viewMode === 'category' ? 'category' : 'priority'

    return (
        <div className="card bg-dark text-light shadow-sm mb-3">
            <div className="card-header border-0">
            <div className="d-flex justify-content-between align-items-center">
                <ul className="nav nav-pills">
                    {navItems.map((item, index)=> {
                        return <li key={index} className="nav-item">
                            <button className={"nav-link "+ (navItems[index]===activeNav.data?'active':'text-light')}
                            onClick={()=>{setActiveNav({field, data:navItems[index]})}}>
                                {translateItem(item, viewMode, t)}
                            </button>
                        </li>
                    })}
                </ul>
                
                <div className="d-flex ms-auto">
                    <div className="btn-group btn-group-sm me-3" role="group">
                        <button 
                            className={`btn ${viewMode==='status' ? 'btn-success' : 'btn-outline-success'}`}
                            onClick={() => {
                                setViewMode('status')
                                setActiveNav({field: 'status', data: 'All Tasks'})
                            }}>
                            {t('navTabs.status')}
                        </button>
                        <button 
                            className={`btn ${viewMode==='category'? 'btn-success' : 'btn-outline-success'}`}
                            onClick={() => {
                                setViewMode('category')
                                setActiveNav({field: 'category', data: 'All Tasks'})
                            }}>
                            {t('navTabs.category')}
                        </button>
                        <button 
                            className={`btn ${viewMode==='priority'? 'btn-success' : 'btn-outline-success'}`}
                            onClick={() => {
                                setViewMode('priority')
                                setActiveNav({field: 'category', data: 'All Tasks'})
                            }}>
                            {t('navTabs.priority')}
                        </button>
                    </div>
                    <form className="d-flex" role="search" onSubmit={(e)=>{
                    e.preventDefault()
                    setSearchTitle(searchText)
                    fetchingFunction()
                    }}>
                        <input className="form-control form-control-sm bg-secondary text-light border-0 me-2" type="search" placeholder="Search tasks..." aria-label="Search" onChange={(e)=>{
                            const value = e.target.value
                            setSearchText(value)
                            if (!value){
                                setSearchTitle('')
                                fetchingFunction()
                            }
                        }}/>
                        <button className="btn btn-sm btn-light" type="submit">{t('navTabs.search')}</button>
                    </form>
                </div>
            </div>
            </div>
        </div>
    )
}

export default NavTabsBar