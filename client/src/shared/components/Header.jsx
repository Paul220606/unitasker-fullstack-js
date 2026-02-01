import { useContext } from "react"

import { AppContext } from "../../app/App"

function Header() {
    const {user} = useContext(AppContext)
    return (
        <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
            <div className="container-fluid">
                <a className="navbar-brand" href="/">Unitasker</a>
                <div className="collapse navbar-collapse" id="navbarSupportedContent">
                    { user?(
                    <ul className="navbar-nav ms-auto mb-2 mb-lg-0">
                        <li className="nav-item dropdown">
                            <a className="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                                {user.length<12?user:(user.substring(0, 13))}
                            </a>
                            <ul className="dropdown-menu">
                                <li><a className="dropdown-item" href="#">Action</a></li>
                                <li><a className="dropdown-item" href="#">Another action</a></li>
                                <li><hr className="dropdown-divider"/></li>
                                <li><a className="dropdown-item" href="#">Something else here</a></li>
                            </ul>
                        </li>
                        <li>Something else here</li>
                    </ul>
                    ):(
                    <ul className="navbar-nav ms-auto mb-2 mb-lg-0">
                            <li className="nav-item">
                                <a className="nav-link" href="/login">
                                    Sign in 
                                    <i className="bi bi-box-arrow-in-right"></i>
                                </a>
                            </li>
                            <li className="nav-item">
                                <a className="nav-link" href="/register">
                                    Register
                                    <i className="bi bi-file-plus"></i>
                                </a>
                            </li>
                    </ul>
                    )}
                </div>
            </div>
        </nav>
    )
}

export default Header