function Header() {
    return (
        <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
            <div className="container-fluid">
                <a className="navbar-brand" href="/">Unitasker</a>
                <div className="collapse navbar-collapse" id="navbarSupportedContent">
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
                </div>
            </div>
        </nav>
    )
}

export default Header