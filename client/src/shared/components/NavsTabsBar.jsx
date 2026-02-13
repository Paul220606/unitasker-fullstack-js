import { useState, useEffect } from "react"
function NavTabsBar({navItems, activeNav, setActiveNav, fetchingFunction, setSearchTitle}) {
    const [searchText, setSearchText] = useState('')
    return (
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
                {/* Handle search function */}
                <form className="d-flex ms-auto" role="search" onSubmit={(e)=>{
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
    )
}

export default NavTabsBar