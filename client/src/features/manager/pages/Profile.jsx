import mammoth from 'mammoth'
import { useState, useContext, useEffect, useRef } from 'react'

import { AppContext } from '../../../app/App'
import { validateAllInputs } from '../../../shared/utils/validateInput'
import { editProfile } from '../manager.api'
import { createNullInputObject, createInputObject } from '../../../shared/utils/createInitialState'
import FormFields from '../../../shared/components/Form/FormFields'
import useFetchingData from '../../../shared/hooks/useFetchingData'
import FormModal from '../../../shared/components/Form/FormModal'
import { showToast } from '../../../shared/utils/toast'

export default function Profile() {
    const {user, loading, setLoading, avaUrl, setAvaUrl} = useContext(AppContext)
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
        textMessage: 'Categories',
        component: 'textarea',
        placeholder: 'Type your usual categories, seperated by enter.',
        value:  convertMultilines(loadedCategories) || 'Error',
        required: true,
        col: 6
    }
    const profileDataList = [
        {
            purpose: 'fullName',
            textMessage: 'Full Name',
            type: 'text',
            placeholder: 'e.g. Paul Tran',
            value: profileData.fullName,
            required: true,
            col: 6
        },
        {
            purpose: 'username',
            textMessage: 'Username',
            type: 'text',
            placeholder: 'e.g. paul1234',
            value: profileData.username,
            required: true,
            col: 6
        },
        {
            purpose: 'email',
            textMessage: 'Email',
            type: 'email',
            placeholder: 'e.g. paul@gmail.com',
            value: profileData.email,
            required: true,
            col: 6
        },
        {
            purpose: 'phone',
            textMessage: 'Phone Number',
            type: 'tel',
            placeholder: '+61 123456789',
            value: profileData.phone,
            required: true,
            col: 6
        },
        {
            purpose: 'location',
            textMessage: 'Location',
            type: 'text',
            placeholder: 'Melbourne, Australia',
            value: profileData.location,
            required: false,
            col: isEditingProfile?12:6
        },
        ...isEditingProfile?[{}]: [{
            textMessage: 'Location',
            value: profileData.joinedDate,
            col: 6
        }]
    ]
    const profileStats = [
        {
            text: 'Tasks',
            value: counterData.tasks,
            type: 'primary'
        },
        {
            text: 'Completed',
            value: counterData.completed,
            type: 'success'
        },
        {
            text: 'Ratings',
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
                showToast('Invalid field(s)', err, 'warning')
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
                    localStorage.setItem('categories', convertMultilines(data.categories))
                    setIsEditingProfile(false)
                } else {
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
            showToast("Unappropriate type", "This type is not supported by our websit to convert text.", 'danger')
            return
        }
        const normalized = text.replace(/\n\n+/g, '\n').trim()
        setData(prev => ({...prev, categories: detectSeparator(normalized) === '\n'?normalized:convertMultilines(normalized)}))
        skipResetRef.current = true     
        isEditingCategories || setIsEditingCategories(true)
    }

    return (
        <div className="container-fluid p-4">

            <div className="text-dark mb-4">
                <h2>My Profile</h2>
                <p className="text-secondary">Manage your account settings and preferences</p>
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
                            <span className="badge bg-success mb-3">Active Member</span>

                            
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
                            <h6 className="fw-bold mb-3">Quick Actions</h6>
                            <div className="d-grid gap-2">
                                <button 
                                    className="btn btn-outline-light btn-sm text-start"
                                    data-bs-toggle="modal"
                                    data-bs-target="#formModal">
                                    <i className="bi bi-key me-2"></i>Change Password
                                </button>
                                <button className="btn btn-outline-light btn-sm text-start">
                                    <i className="bi bi-download me-2"></i>Export My Data
                                </button>
                                <button className="btn btn-outline-light btn-sm text-start">
                                    <i className="bi bi-shield-check me-2"></i>Two-Factor Auth
                                </button>
                                <button className="btn btn-outline-danger btn-sm text-start">
                                    <i className="bi bi-trash me-2"></i>Delete Account
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="col-lg-8">
                    <div className="card bg-dark text-light border-0 shadow-sm mb-3">
                        <div className="card-body p-4">
                            <div className="d-flex justify-content-between align-items-center mb-3">
                                <h5 className="fw-bold mb-0">Personal Information</h5>
                                <button 
                                    className="btn btn-light btn-sm"
                                    onClick={() => {
                                        if (isEditingCategories) setIsEditingCategories(!isEditingCategories)
                                        setIsEditingProfile(!isEditingProfile)
                                    }}>
                                    <i className={`bi ${isEditingProfile ? 'bi-x' : 'bi-pencil'} me-1`}></i>
                                    {isEditingProfile ? 'Cancel' : 'Edit'}
                                </button>
                            </div>

                            {isEditingProfile ? (
                                <form onSubmit={handleEditSubmit}>
                                    <FormFields inputs={profileDataList.filter(item => item.textMessage !== undefined)} data={data} setData={setData} errors={errors} setErrors={setErrors} isOpened={isEditingProfile}/>
                                    <div className="mt-3 d-flex gap-2 justify-content-end">
                                        <button type="button" className="btn btn-secondary" onClick={() => setIsEditingProfile(false)}>Cancel</button>
                                        <button type="submit" className="btn btn-light">Save Changes</button>
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
                                <h5 className="fw-bold mb-0">Task Preference</h5>
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
                                                Cancel
                                            </button>
                                            <button type="button" className="btn btn-outline-light btn-sm w-100"
                                            onClick={()=>fileInputRef.current.click()}>
                                                <i className="bi bi-download me-2"></i>Import Categories
                                            </button>
                                            <button className="btn btn-outline-warning btn-sm w-100"
                                            type = 'submit'>
                                                <i className="bi bi-arrow-repeat me-2"></i>Update
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
                                            Edit Categories
                                        </button>
                                        <button className="btn btn-outline-light btn-sm w-100" onClick={()=>fileInputRef.current.click()}>
                                            <i className="bi bi-download me-2"></i>Import Categories
                                        </button>
                                        <button className="btn btn-outline-light btn-sm w-100">
                                            <i className="bi bi-box-arrow-up me-2" onClick={(e)=>{
                                                
                                            }}></i>Export Categories
                                        </button>
                                    </div>
                                    
                                </div>
                            )}
                        </div>
                        
                    </div>
                    
                    {/* Notifications */}
                    <div className="card bg-dark text-light border-0 shadow-sm mb-3">
                        <div className="card-body p-4">
                            <h5 className="fw-bold mb-3">Notifications</h5>
                            
                            <div className="form-check form-switch mb-3">
                                <input className="form-check-input" type="checkbox" id="emailNotif" defaultChecked />
                                <label className="form-check-label" htmlFor="emailNotif">
                                    <div className="fw-semibold">Email Notifications</div>
                                    <small className="text-light opacity-75">Receive updates about your tasks via email</small>
                                </label>
                            </div>

                            <div className="form-check form-switch mb-3">
                                <input className="form-check-input" type="checkbox" id="taskReminder" defaultChecked />
                                <label className="form-check-label" htmlFor="taskReminder">
                                    <div className="fw-semibold">Task Reminders</div>
                                    <small className="text-light opacity-75">Get notified 24 hours before deadline</small>
                                </label>
                            </div>

                            <div className="form-check form-switch">
                                <input className="form-check-input" type="checkbox" id="weeklyDigest" />
                                <label className="form-check-label" htmlFor="weeklyDigest">
                                    <div className="fw-semibold">Weekly Summary</div>
                                    <small className="text-light opacity-75">Receive weekly task summary every Monday</small>
                                </label>
                            </div>
                        </div>
                    </div>

                    {/* Privacy */}
                    <div className="card bg-dark text-light border-0 shadow-sm">
                        <div className="card-body p-4">
                            <h5 className="fw-bold mb-3">Privacy & Security</h5>
                            
                            <div className="form-check form-switch mb-3">
                                <input className="form-check-input" type="checkbox" id="publicProfile" />
                                <label className="form-check-label" htmlFor="publicProfile">
                                    <div className="fw-semibold">Public Profile</div>
                                    <small className="text-light opacity-75">Make your profile visible to others</small>
                                </label>
                            </div>

                            <div className="form-check form-switch">
                                <input className="form-check-input" type="checkbox" id="twoFactor" />
                                <label className="form-check-label" htmlFor="twoFactor">
                                    <div className="fw-semibold">Two-Factor Authentication</div>
                                    <small className="text-light opacity-75">Add extra security to your account</small>
                                </label>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <FormModal id="formModal" task={{password: profileData.password}} title="Change Password" textMessage="Confirm" fetchingFunction={()=>{}}/>
        </div>
    )
}