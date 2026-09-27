import { Link } from "react-router-dom"
import { useContext } from "react"
import { useTranslation } from "react-i18next"

import { AppContext } from "../../app/App"

function Footer() {
    const {user} = useContext(AppContext)
    const {t} = useTranslation()

    return (
        <footer className="bg-dark text-light pt-5 pb-3 mt-auto">
            <div className="container">
                <div className="row">

                    <div className="col-md-4 mb-4">
                    <h2 className="h5 fw-bold">Unitasker</h2>
                    <p className="text-muted-on-dark small">
                    {t('footer.tagline')}
                    </p>
                    </div>

                    <div className="col-md-4 mb-4">
                    <h2 className="h6 fw-semibold">{t('footer.quickLinks')}</h2>
                    <ul className="list-unstyled small">
                    <li>
                    <Link to="/" className="text-muted-on-dark text-decoration-none d-inline-block py-1">
                        {t('footer.home')}
                    </Link>
                    </li>
                    {user?
                    <li>
                    <Link to="/tasks" className="text-muted-on-dark text-decoration-none d-inline-block py-1">
                        {t('footer.browseTasks')}
                    </Link>
                    </li> 
                    :
                    <li>
                        <Link to="/login" className="text-muted-on-dark text-decoration-none d-inline-block py-1">
                            {t('footer.login')}
                        </Link>
                        <span className="text-muted-on-dark mx-1" aria-hidden="true">/</span>
                        <Link to="/register" className="text-muted-on-dark text-decoration-none d-inline-block py-1">
                            {t('footer.register')}
                        </Link>
                    </li>}
                    
                    <li>
                    <Link to="/about" className="text-muted-on-dark text-decoration-none d-inline-block py-1">
                        {t('footer.about')}
                    </Link>
                    </li>
                    </ul>
                    </div>

                    <div className="col-md-4 mb-4">
                    <h2 className="h6 fw-semibold">{t('footer.connect')}</h2>
                    <p className="text-muted-on-dark small mb-2">
                    support@unitasker.com
                    </p>
                    <div className="d-flex gap-3" aria-hidden="true">
                    <i className="bi bi-facebook fs-5"></i>
                    <i className="bi bi-twitter fs-5"></i>
                    <i className="bi bi-github fs-5"></i>
                    </div>
                    </div>

                </div>

                <hr className="border-secondary" />

                <div className="text-center text-muted-on-dark small">
                    {t('footer.copyright', {year: new Date().getFullYear()})}
                </div>
            </div>
        </footer>
    )
}

export default Footer