import { useContext } from "react"
import { Link } from "react-router-dom"

import { AppContext } from "../../app/App"

function Header() {
    const {setUser, user} = useContext(AppContext)
    return (
        <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
            <div className="container-fluid">
                <Link className="navbar-brand" to="/">Unitasker</Link>
                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation"/>

                <div className="collapse navbar-collapse" id="navbarSupportedContent">
                    { user?(
                    <ul className="navbar-nav ms-auto mb-2 mb-lg-0">
                        <li className="nav-item dropdown">
                            <Link className="nav-link dropdown-toggle" to="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                                <i className="bi bi-person-fill me-1"></i>
                                {user.length<12?user:(user.substring(0, 13))}
                            </Link>
                            <ul className="dropdown-menu dropdown-menu-dark">
                                <li><Link className="dropdown-item" to="/profile"><i className="bi bi-person-circle me-1"></i>My profile</Link></li>
                                <li><Link className="dropdown-item" to="/tasks"><i className="bi bi-list-task me-1"></i>My tasks</Link></li>
                                <li><hr className="dropdown-divider"/></li>
                                <li><Link className="dropdown-item" onClick={()=> {
                                    localStorage.removeItem('user')
                                    localStorage.removeItem('token')
                                    setUser('')
                                    window.location.href = '/'
                                }}><i className="bi bi-box-arrow-right me-1"></i>Log out</Link></li>
                            </ul>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link" to="#">
                                <i className="bi bi-globe me-1"></i>
                                Language
                            </Link>
                        </li>
                    </ul>
                    ):(
                    <ul className="navbar-nav ms-auto mb-2 mb-lg-0">
                            <li className="nav-item">
                                <Link className="nav-link" to="/login">
                                    <i className="bi bi-box-arrow-in-right me-1"></i>
                                    Sign in 
                                </Link>
                            </li>
                            <li className="nav-item">
                                <Link className="nav-link" to="/register">
                                    <i className="bi bi-file-plus me-1"></i>
                                    Register
                                    
                                </Link>
                            </li>
                            <li className="nav-item">
                                <Link className="nav-link" to="/register">
                                    <i className="bi bi-globe me-1"></i>
                                    Language
                                </Link>
                            </li>
                    </ul>
                    )}
                </div>
            </div>
        </nav>
    )
}

export default Header