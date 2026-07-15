import { useContext } from "react"
import { Link } from "react-router-dom"
import { NavDropdown } from 'react-bootstrap'
import { useTranslation } from "react-i18next"

import { AppContext } from "../../app/App"

function Header() {
    const {setUser, user, setLoading, avaUrl} = useContext(AppContext)
    const {i18n, t} = useTranslation()

    const changeLanguage = (lang) => {
        i18n.changeLanguage(lang)
        localStorage.setItem('language', lang)
    }

    const languageDropDown = (
        <NavDropdown
        title = {<><i className = "bi bi-globe me-1"></i>{t('nav.language')}</>}
        id = "language-dropdown"
        className="nav-item"
        menuVariant="dark">
            <NavDropdown.Item onClick = {() => changeLanguage('en')}>
                English
            </NavDropdown.Item>
            <NavDropdown.Item onClick = {() => changeLanguage('vi')}>
                Tiếng Việt
            </NavDropdown.Item>
        </NavDropdown>
    )

    return (
        <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
            <div className="container-fluid">
                <Link className="navbar-brand" to="/">Unitasker</Link>
                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label={t('nav.toggleNavigation')}>
                    <span className="navbar-toggler-icon"></span>
                </button>

                <div className="collapse navbar-collapse" id="navbarSupportedContent">
                    { user?(
                    <ul className="navbar-nav ms-auto mb-2 mb-lg-0">
                        <NavDropdown 
                            title={
                                <>
                                    {avaUrl
                                        ? <img 
                                            src={avaUrl} 
                                            className="me-1"
                                            alt="avatar" 
                                            style={{
                                                width: '24px', 
                                                height: '24px', 
                                                objectFit: 'cover',
                                                borderRadius: '50%',
                                                verticalAlign: 'middle'
                                            }} 
                                        />
                                        : <i className="bi bi-person-fill me-1"></i>
                                    }
                                    {user.length < 12 ? user : user.substring(0, 13)}
                                </>
                            }
                            id="user-dropdown"
                            className="nav-item"
                            menuVariant="dark"
                        >
                            <NavDropdown.Item as={Link} to="/">
                                <i className="bi bi-clipboard2-data me-1"></i>
                                {t('nav.dashboard')}
                            </NavDropdown.Item>
                            <NavDropdown.Item as={Link} to="/profile">
                                <i className="bi bi-person-circle me-1"></i>
                                {t('nav.myProfile')}
                            </NavDropdown.Item>
                            <NavDropdown.Item as={Link} to="/tasks">
                                <i className="bi bi-list-task me-1"></i>
                                {t('nav.myTasks')}
                            </NavDropdown.Item>
                            <NavDropdown.Divider />
                            <NavDropdown.Item onClick={()=> {
                                    localStorage.removeItem('user')
                                    localStorage.removeItem('token')
                                    setUser('')
                                    window.location.href = '/'
                                }}>
                                <i className="bi bi-box-arrow-right me-1"></i>
                                {t('nav.logout')}
                            </NavDropdown.Item>
                        </NavDropdown>
                        {languageDropDown}
                    </ul>
                    ):(
                    <ul className="navbar-nav ms-auto mb-2 mb-lg-0">
                            <li className="nav-item">
                                <Link className="nav-link" to="/login">
                                    <i className="bi bi-box-arrow-in-right me-1"></i>
                                    {t('nav.signIn')}
                                </Link>
                            </li>
                            <li className="nav-item">
                                <Link className="nav-link" to="/register">
                                    <i className="bi bi-file-plus me-1"></i>
                                    {t('nav.register')}
                                </Link>
                            </li>
                            {languageDropDown}
                    </ul>
                    )}
                </div>
            </div>
        </nav>
    )
}

export default Header