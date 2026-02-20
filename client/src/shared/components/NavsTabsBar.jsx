import { useState, useEffect } from "react"
function NavTabsBar({activeNav, setActiveNav, fetchingFunction, setSearchTitle}) {
    const [searchText, setSearchText] = useState('')
    const [isStatusView, setIsStatusView] = useState(true)
    const statusItems = ['All Tasks', 'Pending', 'In Progress', 'Completed', 'Canceled'] 
    const categoryItems = ['All Tasks', ...['Housework', 'Schoolwork', 'Job', 'Other']]
    const navItems = isStatusView? statusItems: categoryItems
    const field = isStatusView? 'status': 'category'
    return (
        <div className="card bg-dark text-light shadow-sm mb-3">
            <div className="card-header border-0">
            <div className="d-flex justify-content-between align-items-center">
                <ul className="nav nav-pills">
                    {navItems.map((item, index)=> {
                        return <li key={index} className="nav-item">
                            <button className={"nav-link "+ (navItems[index]===activeNav.data?'active':'text-light')}
                            onClick={()=>{setActiveNav({field, data:navItems[index]})}}>
                                {item}
                            </button>
                        </li>
                    })}
                </ul>
                
                <div className="d-flex ms-auto">
                    <div className="btn-group btn-group-sm me-3" role="group">
                        <button 
                            className={`btn ${isStatusView ? 'btn-success' : 'btn-outline-success'}`}
                            onClick={() => {
                                setIsStatusView(true)
                                setActiveNav({field: 'status', data: 'All Tasks'})
                            }}>
                            Status
                        </button>
                        <button 
                            className={`btn ${!isStatusView ? 'btn-success' : 'btn-outline-success'}`}
                            onClick={() => {
                                setIsStatusView(false)
                                setActiveNav({field: 'category', data: 'All Tasks'})
                            }}>
                            Category
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
                        <button className="btn btn-sm btn-light" type="submit">Search</button>
                    </form>
                </div>
            </div>
            </div>
        </div>
    )
}

export default NavTabsBar