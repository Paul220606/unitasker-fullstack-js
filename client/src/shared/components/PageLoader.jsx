import { useTranslation } from 'react-i18next'
import '../../styles/pageLoader.scss'

function PageLoader() {
    const { t } = useTranslation()
    return (
        <div className="page-loader" role="status" aria-live="polite">
            <div className="page-loader__dots" aria-hidden="true">
                <span></span>
                <span></span>
                <span></span>
            </div>
            <p className="page-loader__text">{t('common.loading')}</p>
        </div>
    )
}

export default PageLoader