import { Link } from "react-router-dom"
import { useContext } from "react"
import { useTranslation } from "react-i18next"

import App, { AppContext } from "../../app/App"

function Footer() {
    const {user} = useContext(AppContext)
    const {t} = useTranslation()

    return (
        <footer className="bg-dark text-light pt-5 pb-3 mt-auto">
            <div className="container">
                <div className="row">

                    <div className="col-md-4 mb-4">
                    <h5 className="fw-bold">Unitasker</h5>
                    <p className="text-secondary small">
                    {t('footer.tagline')}
                    </p>
                    </div>

                    <div className="col-md-4 mb-4">
                    <h6 className="fw-semibold">{t('footer.quickLinks')}</h6>
                    <ul className="list-unstyled small">
                    <li>
                    <Link to="/" className="text-secondary text-decoration-none">
                        {t('footer.home')}
                    </Link>
                    </li>
                    {user?
                    <li>
                    <Link to="/tasks" className="text-secondary text-decoration-none">
                        {t('footer.browseTasks')}
                    </Link>
                    </li> 
                    :
                    <>
                        <Link to="/login" className="text-secondary text-decoration-none">
                            {t('footer.login')}
                        </Link>
                        <Link to="/register" className="text-secondary text-decoration-none">
                            {t('footer.register')}
                        </Link>
                    </>}
                    
                    <li>
                    <Link to="/about" className="text-secondary text-decoration-none">
                        {t('footer.about')}
                    </Link>
                    </li>
                    </ul>
                    </div>

                    <div className="col-md-4 mb-4">
                    <h6 className="fw-semibold">{t('footer.connect')}</h6>
                    <p className="text-secondary small mb-2">
                    support@unitasker.com
                    </p>
                    <div className="d-flex gap-3">
                    <i className="bi bi-facebook fs-5"></i>
                    <i className="bi bi-twitter fs-5"></i>
                    <i className="bi bi-github fs-5"></i>
                    </div>
                    </div>

                </div>

                <hr className="border-secondary" />

                <div className="text-center text-secondary small">
                    {t('footer.copyright', {year: new Date().getFullYear()})}
                </div>
            </div>
        </footer>
    )
}

export default Footer
