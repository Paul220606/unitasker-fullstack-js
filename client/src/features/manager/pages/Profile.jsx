import mammoth from 'mammoth'
import { useState, useContext, useEffect, useRef } from 'react'
import { useTranslation } from 'react-i18next'

import { AppContext } from '../../../app/App'
import { validateAllInputs } from '../../../shared/utils/validateInput'
import { editProfile } from '../manager.api'
import { createNullInputObject, createInputObject } from '../../../shared/utils/createInitialState'
import FormFields from '../../../shared/components/Form/FormFields'
import useFetchingData from '../../../shared/hooks/useFetchingData'
import FormModal from '../../../shared/components/Form/FormModal'
import downloadFile from '../../../shared/utils/downloadFile'
import { requestData } from '../../../shared/utils/requestData'
import { showToast } from '../../../shared/utils/toast'

export default function Profile() {
    const {user, loading, setLoading, avaUrl, setAvaUrl, categoriesList, setCategoriesList} = useContext(AppContext)
    const {t} = useTranslation()
    const [isEditingProfile, setIsEditingProfile] = useState(false)
    const [isEditingCategories, setIsEditingCategories] = useState(false)
    const [profileData, setProfileData] = useState({})
    const [counterData, setCounterData] = useState({})
    const [loadedCategories, setLoadedCategories] = useState('')
    const fileInputRef = useRef()
    const skipResetRef = useRef(false)
    
    const loadData = useFetchingData(user, 'profile', 'render', setLoading, [setProfileData, setCounterData], {})
    const detectSeparator = (text) => {
        const seperators = ['\n', ', ', '; ', ' | ', '\t']
        const counts = seperators.map (sep => ({
            sep,
            count: text.split(sep).length -1
        }))
        const best = counts.sort((a,b)=> b.count - a.count)[0]
        return best.count > 0 ? best.sep : '\n'
    }
    const convertMultilines = (text) => {
        if (!text) return
        const splitSep = detectSeparator(text)
        let joinSep = splitSep=== '\n' ? ', ':'\n'
        
        const lst = text.split(splitSep)
        return lst.join(joinSep)
    }

    const categories = {
        purpose: 'categories',
        rows: 5,
        textMessage: t('profile.categories'),
        component: 'textarea',
        placeholder: t('profile.categoriesPlaceholder'),
        value:  convertMultilines(loadedCategories) || 'Error',
        required: true,
        col: 6
    }
    const profileDataList = [
        {
            purpose: 'fullName',
            textMessage: t('profile.fullName'),
            type: 'text',
            placeholder: t('common.placeholders.fullName'),
            value: profileData.fullName,
            required: true,
            col: 6
        },
        {
            purpose: 'username',
            textMessage: t('profile.username'),
            type: 'text',
            placeholder: t('common.placeholders.username'),
            value: profileData.username,
            required: true,
            col: 6
        },
        {
            purpose: 'email',
            textMessage: t('profile.email'),
            type: 'email',
            placeholder: t('common.placeholders.email'),
            value: profileData.email,
            required: true,
            col: 6
        },
        {
            purpose: 'phone',
            textMessage: t('profile.phone'),
            type: 'tel',
            placeholder: t('common.placeholders.phone'),
            value: profileData.phone,
            required: true,
            col: 6
        },
        {
            purpose: 'location',
            textMessage: t('profile.location'),
            type: 'text',
            placeholder: t('common.placeholders.location'),
            value: profileData.location,
            required: false,
            col: isEditingProfile?12:6
        },
        ...isEditingProfile?[{}]: [{
            textMessage: t('profile.joinedDate'),
            value: profileData.joinedDate,
            col: 6
        }]
    ]
    const profileStats = [
        {
            text: t('profile.stats.tasks'),
            value: counterData.tasks,
            type: 'primary'
        },
        {
            text: t('profile.stats.completed'),
            value: counterData.completed,
            type: 'success'
        },
        {
            text: t('profile.stats.ratings'),
            value: counterData.ratings,
            type: 'warning'
        }
    ]
    
    const [data, setData] = useState(()=> (createInputObject(profileDataList)))
    const [errors, setErrors] = useState(()=> (createNullInputObject(profileDataList)))
    let dataLst = []
    useEffect(() => {
        if (profileData.imageUrl) setAvaUrl(profileData.imageUrl)
            if (profileData.categories) setLoadedCategories(profileData.categories)
            if (isEditingProfile){
            dataLst = profileDataList
            setData(createInputObject(dataLst))
            setErrors(createNullInputObject(dataLst))
        } else if (isEditingCategories){
            dataLst = [categories]
            if (skipResetRef.current){
                skipResetRef.current = false
            } else {
                setData(createInputObject(dataLst))
            }
            setErrors(createNullInputObject(dataLst))
        } 
        
    }, [profileData, isEditingProfile, isEditingCategories])

    const handleEditSubmit = async (e) => {
        e.preventDefault()
        const newErrors = validateAllInputs(dataLst.filter(item => item.textMessage !== undefined), data, setErrors, false)
        let skip
        Object.entries(newErrors).forEach((arr)=>{
            const err = arr[1]
            if (err) {
                showToast(t('toast.invalidFields'), err, 'warning')
                skip = true
            }
        })
        if (skip) return
        try {
            setLoading(true)
            const res = await editProfile({...isEditingProfile? data: {categories: convertMultilines(data.categories)}})
            if (res.success){
                loadData()
                if (isEditingProfile){
                    setIsEditingProfile(false)
                } else {
                    const newCategories = convertMultilines(data.categories)
                    localStorage.setItem('categories', newCategories)
                    setCategoriesList(newCategories)
                    setIsEditingCategories(false)
                }
                showToast(res.state, res.message, 'success')
            } else {
                showToast(res.state, res.message)
            }
        } catch (err) {
            throw err
        } finally {
            setLoading(false)
        }
    }

    const handleImageChange = async (e) => {
        const file = e.target.files[0]
        if (!file) return 

        const reader = new FileReader()
        reader.onload = async () => {
            const imageUrl = reader.result
            try {
                setLoading(true)
                const res = await editProfile({imageUrl})
                if (res.success){
                    loadData()
                    showToast(res.state, res.message, 'success')
                } else {
                    showToast(res.state, res.message)
                }
            } catch (err){
                throw err
            } finally {
                setLoading(false)
            }
        }
        reader.readAsDataURL(file)
    }

    const handleTextChange = async (e) => {
        const file = e.target.files[0]
        if (!file) return
        let text = ""
        if (file.name.endsWith(".txt")){
            text = await file.text()
        } else if (file.name.endsWith(".docx")){
            const arrayBuffer = await file.arrayBuffer()
            const result = await mammoth.extractRawText({arrayBuffer})
            text = result.value
        } else {
            showToast(t('profile.unsupportedFileTitle'), t('profile.unsupportedFileMessage'), 'danger')
            return
        }
        const normalized = text.replace(/\n\n+/g, '\n').trim()
        setData(prev => ({...prev, categories: detectSeparator(normalized) === '\n'?normalized:convertMultilines(normalized)}))
        skipResetRef.current = true     
        isEditingCategories || setIsEditingCategories(true)
    }

    const handleExportCategories = () => {
        const list = convertMultilines(loadedCategories)?.split('\n').filter(Boolean) || []
        if (list.length === 0) {
            showToast(t('profile.exportDataFailedTitle'), t('profile.exportCategoriesFailedMessage'), 'warning')
            return
        }
        downloadFile(list.join('\n'), 'unitasker-categories.txt', 'text/plain')
        showToast(t('profile.exportDataSuccessTitle'), t('profile.exportCategoriesSuccessMessage'), 'success')
    }

    const handleExportData = async () => {
        try{
            setLoading(true)
            const sortParams = {sortTitle: '#', sortOrder: 'asc'}
            const [listRes, binRes] = await Promise.all([
                requestData(sortParams, 'task', 'fullList', 'get'),
                requestData(sortParams, 'task', 'fullBin', 'get')
            ])
            const exportPayLoad = {
                exportedAt: newDate().toISOString(),
                profile: profileData,
                stats: counterData,
                categories: loadedCategories,
                tasks: listRes.tasks,
                deletedTasks: binRes.tasks
            }
            downloadFile(JSON.stringify(exportPayLoad, null, 2), `unitasker-data-${profileData.username || 'export'}.json`, 'application/json')
            showToast(t('profile.exportDataSuccessTitle'), t('profile.exportDataSuccessMessage'), 'success')
        } catch (err){
            showToast(t('profile.exportDataFailedTitle'), t('profile.exportDataFailedMessage'), 'danger')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="container-fluid p-4">

            <div className="text-dark mb-4">
                <h2>{t('profile.title')}</h2>
                <p className="text-secondary">{t('profile.subtitle')}</p>
            </div>

            <div className="row g-4">
                <div className="col-lg-4">
                    <div className="card bg-dark text-light border-0 shadow-sm mb-3">
                        <div className="card-body text-center p-4">
                            <div className="position-relative d-inline-block mb-3">
                                <div className="bg-light bg-opacity-10 rounded-circle d-flex align-items-center justify-content-center" style={{width: '120px', height: '120px'}}>
                                    {
                                        avaUrl?
                                        <img src={avaUrl} alt="avatar" style={{width: '100%', height: '100%', objectFit: 'cover'}} />
                                        :
                                        <i className="bi bi-person-fill text-light" style={{fontSize: '60px'}}></i>
                                    }
                                </div>
                                <input
                                type="file"
                                accept="image/*"
                                capture="environment"
                                onChange={handleImageChange}
                                style={{ display: 'none' }}
                                id="avatar-input"
                                />
                                <button className="btn btn-light btn-sm rounded-circle position-absolute bottom-0 end-0" onClick={() => document.getElementById('avatar-input').click()}>
                                    <i className="bi bi-camera"></i>
                                </button>
                            </div>


                            <h4 className="fw-bold mb-1">{profileData.fullName}</h4>
                            <p className="text-light opacity-75 mb-2">@{profileData.username}</p>
                            <span className="badge bg-success mb-3">{t('profile.activeMember')}</span>

                            
                            <div className="row text-center mt-4 pt-3 border-top border-secondary">
                                {
                                    profileStats.map((stat, index)=>(
                                        <div key={index} className="col-4">
                                            <h5 className={`fw-bold text-${stat.type} mb-0`}>{stat.value}</h5>
                                            <small className="text-light opacity-75">{stat.text}</small>
                                        </div>
                                    ))
                                }
                            </div>
                        </div>
                    </div>

                    
                    <div className="card bg-dark text-light border-0 shadow-sm">
                        <div className="card-body p-3">
                            <h6 className="fw-bold mb-3">{t('profile.quickActions')}</h6>
                            <div className="d-grid gap-2">
                                <button 
                                    className="btn btn-outline-light btn-sm text-start"
                                    data-bs-toggle="modal"
                                    data-bs-target="#formModal">
                                    <i className="bi bi-key me-2"></i>{t('profile.changePassword')}
                                </button>
                                <button className="btn btn-outline-light btn-sm text-start" onClick={handleExportData}>
                                    <i className="bi bi-download me-2"></i>{t('profile.exportData')}
                                </button>
                                <button className="btn btn-outline-light btn-sm text-start">
                                    <i className="bi bi-shield-check me-2"></i>{t('profile.twoFactorAuth')}
                                </button>
                                <button className="btn btn-outline-danger btn-sm text-start">
                                    <i className="bi bi-trash me-2"></i>{t('profile.deleteAccount')}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="col-lg-8">
                    <div className="card bg-dark text-light border-0 shadow-sm mb-3">
                        <div className="card-body p-4">
                            <div className="d-flex justify-content-between align-items-center mb-3">
                                <h5 className="fw-bold mb-0">{t('profile.personalInformation')}</h5>
                                <button 
                                    className="btn btn-light btn-sm"
                                    onClick={() => {
                                        if (isEditingCategories) setIsEditingCategories(!isEditingCategories)
                                        setIsEditingProfile(!isEditingProfile)
                                    }}>
                                    <i className={`bi ${isEditingProfile ? 'bi-x' : 'bi-pencil'} me-1`}></i>
                                    {isEditingProfile ? t('profile.cancel') : t('profile.edit')}
                                </button>
                            </div>

                            {isEditingProfile ? (
                                <form onSubmit={handleEditSubmit}>
                                    <FormFields inputs={profileDataList.filter(item => item.textMessage !== undefined)} data={data} setData={setData} errors={errors} setErrors={setErrors} isOpened={isEditingProfile}/>
                                    <div className="mt-3 d-flex gap-2 justify-content-end">
                                        <button type="button" className="btn btn-secondary" onClick={() => setIsEditingProfile(false)}>{t('profile.cancel')}</button>
                                        <button type="submit" className="btn btn-light">{t('profile.saveChanges')}</button>
                                    </div>
                                </form>
                            ) : (
                                <div className="row g-3">
                                    {
                                        profileDataList.map((data, index)=>(
                                            <div key={index} className={`col-md-${data.col}`}>
                                                <label className="text-light opacity-50 small mb-1">{data.textMessage}</label>
                                                <div className="fw-semibold">{data.value}</div>
                                            </div>
                                        ))
                                    }
                                    
                                </div>
                            )}
                        </div>
                    </div>
                    
                    <div className="card bg-dark text-light border-0 shadow-sm mb-3">
                        <div className="card-body p-4">
                            <div className="d-flex justify-content-between align-items-center mb-3">
                                <h5 className="fw-bold mb-0">{t('profile.taskPreference')}</h5>
                            </div>
                            <input
                            type="file" accept=".txt, .doc, .docx" ref={fileInputRef} style={{display: "none"}} onChange={handleTextChange}></input>
                            {isEditingCategories ? (
                                <form onSubmit={handleEditSubmit}>
                                    <FormFields inputs={[categories]} data={data} setData={setData} errors={errors} setErrors={setErrors} isOpened={isEditingCategories} extra={(
                                        <div className="col-md-6 d-flex flex-column justify-content-center gap-2">
                                            <button type="button" className="btn btn-outline-light btn-sm w-100" 
                                            onClick={() => {
                                                setIsEditingCategories(!isEditingCategories)
                                                }}>
                                                <i className={`bi bi-x-circle me-2`}></i>
                                                {t('profile.cancel')}
                                            </button>
                                            <button type="button" className="btn btn-outline-light btn-sm w-100"
                                            onClick={()=>fileInputRef.current.click()}>
                                                <i className="bi bi-download me-2"></i>{t('profile.importCategories')}
                                            </button>
                                            <button className="btn btn-outline-warning btn-sm w-100"
                                            type = 'submit'>
                                                <i className="bi bi-arrow-repeat me-2"></i>{t('profile.update')}
                                            </button>
                                        </div>
                                    )}/>
                                </form>
                            ) : (
                                <div className="row g-3">
                                    <div className={`col-md-${categories.col} d-flex flex-column justify-content-center pb-4`} rows = {categories.rows}>
                                        <label className="text-light opacity-50 small mb-1">{categories.textMessage}</label>
                                        <div className="fw-semibold border rounded p-2" style={{ whiteSpace: "pre-line" }}>{categories.value}</div>
                                    </div>
                                    <div className="col-md-6 d-flex flex-column justify-content-center gap-2">
                                        <button className="btn btn-outline-light btn-sm w-100" 
                                        onClick={() => {
                                            if (isEditingProfile) setIsEditingProfile(!isEditingProfile)
                                            setIsEditingCategories(!isEditingCategories)
                                            }}>
                                            <i className={`bi bi-pencil me-2`}></i>
                                            {t('profile.editCategories')}
                                        </button>
                                        <button className="btn btn-outline-light btn-sm w-100" onClick={()=>fileInputRef.current.click()}>
                                            <i className="bi bi-download me-2"></i>{t('profile.importCategories')}
                                        </button>
                                        <button className="btn btn-outline-light btn-sm w-100" onClick={handleExportCategories}>
                                            <i className="bi bi-box-arrow-up me-2"></i>{t('profile.exportCategories')}
                                        </button>
                                    </div>
                                    
                                </div>
                            )}
                        </div>
                        
                    </div>
                    
                    {/* Notifications */}
                    <div className="card bg-dark text-light border-0 shadow-sm mb-3">
                        <div className="card-body p-4">
                            <h5 className="fw-bold mb-3">{t('profile.notifications.title')}</h5>
                            
                            <div className="form-check form-switch mb-3">
                                <input className="form-check-input" type="checkbox" id="emailNotif" defaultChecked />
                                <label className="form-check-label" htmlFor="emailNotif">
                                    <div className="fw-semibold">{t('profile.notifications.emailTitle')}</div>
                                    <small className="text-light opacity-75">{t('profile.notifications.emailDesc')}</small>
                                </label>
                            </div>

                            <div className="form-check form-switch mb-3">
                                <input className="form-check-input" type="checkbox" id="taskReminder" defaultChecked />
                                <label className="form-check-label" htmlFor="taskReminder">
                                    <div className="fw-semibold">{t('profile.notifications.reminderTitle')}</div>
                                    <small className="text-light opacity-75">{t('profile.notifications.reminderDesc')}</small>
                                </label>
                            </div>

                            <div className="form-check form-switch">
                                <input className="form-check-input" type="checkbox" id="weeklyDigest" />
                                <label className="form-check-label" htmlFor="weeklyDigest">
                                    <div className="fw-semibold">{t('profile.notifications.weeklyTitle')}</div>
                                    <small className="text-light opacity-75">{t('profile.notifications.weeklyDesc')}</small>
                                </label>
                            </div>
                        </div>
                    </div>

                    {/* Privacy */}
                    <div className="card bg-dark text-light border-0 shadow-sm">
                        <div className="card-body p-4">
                            <h5 className="fw-bold mb-3">{t('profile.privacy.title')}</h5>
                            
                            <div className="form-check form-switch mb-3">
                                <input className="form-check-input" type="checkbox" id="publicProfile" />
                                <label className="form-check-label" htmlFor="publicProfile">
                                    <div className="fw-semibold">{t('profile.privacy.publicProfileTitle')}</div>
                                    <small className="text-light opacity-75">{t('profile.privacy.publicProfileDesc')}</small>
                                </label>
                            </div>

                            <div className="form-check form-switch">
                                <input className="form-check-input" type="checkbox" id="twoFactor" />
                                <label className="form-check-label" htmlFor="twoFactor">
                                    <div className="fw-semibold">{t('profile.privacy.twoFactorTitle')}</div>
                                    <small className="text-light opacity-75">{t('profile.privacy.twoFactorDesc')}</small>
                                </label>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <FormModal id="formModal" task={{password: profileData.password}} title="Change Password" textMessage={t('common.confirm')} fetchingFunction={()=>{}}/>
        </div>
    )
}