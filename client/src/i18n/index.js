import i18n from 'i18next'
import {initReactI18next} from 'react-i18next'
import LanguageDetector from 'i18next-browser-languagedetector'

import en from './en.json'
import vi from './vi.json'

i18n.use(LanguageDetector)
    .use(initReactI18next)
    .init({
        resources: {
            en: {translation: en},
            vi: {translation: vi}
        },
        fallbackLng: 'en',
        interpolation: {escapeValue: false}
    })

const syncHtmlLang = (lng) => { document.documentElement.lang = (lng || 'en').split('-')[0] }
syncHtmlLang(i18n.resolvedLanguage)
i18n.on('languageChanged', syncHtmlLang)

export default i18n