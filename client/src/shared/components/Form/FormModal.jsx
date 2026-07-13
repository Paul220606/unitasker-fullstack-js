import { useState, useEffect, useContext } from "react"
import { useNavigate } from "react-router-dom"
import { useTranslation } from "react-i18next"

import FormFields from "./FormFields"
import translateItem from "../../utils/translateItem"
import { AppContext } from "../../../app/App"
import {convertDateTimeInput} from "../../utils/convertDateTimeInput"
import { createInputObject, createNullInputObject } from "../../utils/createInitialState"
import { validateAllInputs } from "../../utils/validateInput"
import { showToast } from "../../utils/toast"
import { editTask, deleteTask, deleteTaskPermanent, restoreTask } from "../../../features/tasks/task.api"
import { sendPin } from "../../../features/auth/auth.api"
import { editProfile } from "../../../features/manager/manager.api"

function FormModal({textMessage, id, title, task, fetchingFunction=()=>{}}){
    const dueDateIsNull = (task.dueDate && task.dueDate !== 'None')
    const categories = localStorage.getItem('categories')
    const {loading, setLoading, setUser} = useContext(AppContext)
    const {t} = useTranslation()
    const [showPassword1, setShowPassword1] = useState(false)
    const [showPassword2, setShowPassword2] = useState(false)
    const [showPassword3, setShowPassword3] = useState(false)
    const navigate = useNavigate()
    const taskInputs = [
  {
    purpose: 'title',
    textMessage: t('task.title'),
    type: 'text',
    value: task.title || '',
    required: true,
    col: 12
  },
  {
    purpose: 'description',
    textMessage: t('task.description'),
    component: 'textarea',
    value: task.description || '',
    required: false,
    col: 12
  },
  {
    purpose: 'budget',
    textMessage: t('task.budget'),
    type: 'number',
    value: task.budget || '0',
    required: false,
    col: 6
  },
  {
    purpose: 'status',
    textMessage: t('task.status'),
    component: 'select',
    value: task.status || 'Pending',
    required: true,
    options: [
        'In Progress',
        'Canceled',
        'Pending',
        'Completed'
    ],
    col: 6
  },
  ... ((title !=='View Task' || dueDateIsNull)?
  [{
    purpose: 'dueDate',
    textMessage: t('task.dueDate'),
    type: 'datetime-local',
    value: dueDateIsNull?convertDateTimeInput(task.dueDate) :'',
    col: 12
  }]:[]),
  {
    purpose: 'category',
    textMessage: t('task.category'),
    component: 'select',
    value: task.category || 'Other',
    required: true,
    options: categories? categories.split(', '): [],
    col: 12
  }, 
  {
    purpose: 'priority',
    textMessage: t('task.priority'),
    component: 'select',
    value: task.priority || 'Low',
    required: false,
    options: ['Low', 'Medium', 'High'],
    col: 12
  }
  ]
    const quickInputs = [{
    purpose: 'status',
    textMessage: t('task.status'),
    component: 'select',
    value: task.status || 'Pending',
    required: true,
    options: [
        'In Progress',
        'Canceled',
        'Pending',
        'Completed'
    ],
    col: 12
    }, {
        purpose: 'priority',
        textMessage: t('task.priority'),
        component: 'select',
        value: task.priority || 'Medium',
        required: false,
        options: [
            'High',
            'Medium',
            'Low'
        ],
        col: 12
    }
    ]
    const altLoginInputs = [{
        purpose: 'emailOrUsername',
        textMessage: t('auth.login.emailOrUsername'),
        type: 'text',
        placeholder: t('common.placeholders.username'),
        required: true,
        col: 12
    }]
    const resetPassInputs = [{
        purpose: 'password',
        textMessage: t('auth.resetPassword.newPassword'),
        type: 'password',
        placeholder: t('common.placeholders.password'),
        showPassword: showPassword2,
        setShowPassword: setShowPassword2,
        required: true,
        col: 12
    },
    {
        purpose: 'confirmPassword',
        textMessage: t('auth.resetPassword.confirmPassword'),
        type: 'password',
        placeholder: t('common.placeholders.password'),
        showPassword: showPassword3,
        setShowPassword: setShowPassword3,
        required: true,
        col: 12
    }]
    const changePassInputs = [{
        purpose: 'oldPassword',
        textMessage: t('auth.changePassword.oldPassword'),
        type: 'password',
        placeholder: t('common.placeholders.password'),
        showPassword: showPassword1,
        setShowPassword: setShowPassword1,
        required: true,
        col: 12
    }, ...resetPassInputs]
    let activeInputs
    switch (title){
        case 'Alternative Log In':
            activeInputs = altLoginInputs
            break
        case 'Quick Update':
            activeInputs = quickInputs
            break
        case 'Change Password':
            activeInputs = changePassInputs
            break
        case 'Reset Password':
            activeInputs = resetPassInputs
            break
        default:
            activeInputs = taskInputs
    }
    const [isOpened, setIsOpened] = useState(false)
    const [data, setData] = useState(()=> (createInputObject(activeInputs)))
    const [errors, setErrors] = useState(()=> (createNullInputObject(activeInputs)))
    useEffect(()=> {
      setData(createInputObject(activeInputs))
      setErrors(createNullInputObject(activeInputs))  
    }, [task, isOpened])

    useEffect(()=>{
        const modalEl = document.getElementById(id)
        if (!modalEl) return
        const modalShown = ()=> {setIsOpened(true)}
        const modalHidden = ()=> {setIsOpened(false)}
        const listenModal = ()=> {
            modalEl.addEventListener('shown.bs.modal', modalShown)
            modalEl.addEventListener('hidden.bs.modal', modalHidden)
        }
        listenModal()
        return listenModal
        
    }, [id])

    const handleEditSubmit = async (e) => {
        e.preventDefault()
        const newErrors = validateAllInputs(activeInputs, data, setErrors, false)
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
            const res = await editTask({taskNumber: task.id, ...data})
            if (res.success){
                fetchingFunction()
                showToast(res.state, res.message, 'success')
            } else {
                showToast(res.state, res.message)
            }
        } catch (err) {
            throw err
        }
    }

    const handleResetPassSubmit = async (e)=> {
        e.preventDefault()
        try {
            setLoading(true)
            const res = await editProfile(data)
            if (res.success){
                setUser(localStorage.getItem('user'))
                showToast(res.state, res.message, 'success')
                navigate('/')
            } else {
                showToast(res.state, res.message)
            }
        } catch (err){
            throw err
        } finally {
            setLoading(false)
        }
    }

    const handleChangePassSubmit = async (e)=>{
        e.preventDefault()
        try{
            setLoading(true)
            const res = await editProfile(data)
            if (res.success){
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
    const handleAltLoginSubmit = async (e) =>{
        e.preventDefault()
        try {
            setLoading(true)
            const res = await sendPin({data})
            if (res.success){
                fetchingFunction(res.userId, res.email)
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

    const handleRestoreSubmit = async (e) => {
        e.preventDefault()
        try {
            setLoading(true)
            const res = await restoreTask({taskNumber: task.id, status: task.status})
            if (res.success){
                fetchingFunction()
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

    const handleDeleteSubmit = async (e) => {
        e.preventDefault()
        try {
            setLoading(true)
            const res = await deleteTask({taskNumber: task.id, status: task.status})
            if (res.success){
                fetchingFunction()
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

    const handlePermanentDeleteSubmit = async (e) => {
        e.preventDefault()
        try {
            const res = await deleteTaskPermanent({taskNumber: task.id, status: task.status})
            if (res.success){
                fetchingFunction()
                showToast(res.state, res.message, 'success')
            } else {
                showToast(res.state, res.message)
            }
        } catch (err) {
            throw err
        }
    }

    let handleSubmit
    let formBody = <FormFields inputs={activeInputs} isOpened={isOpened} title={title} data={data} setData={setData} errors={errors} setErrors={setErrors}/>
    switch (title){
        case 'Delete task': 
            handleSubmit = handleDeleteSubmit
            formBody = (
                <div>
                    <h6> {t('modals.deleteTaskConfirm')} </h6>
                    <br /><br />
                </div>
            )
            break
        case 'Delete permanently':
            handleSubmit = handlePermanentDeleteSubmit
            formBody = (
                <div>
                    <h6> {t('modals.deletePermanentConfirm')} </h6>
                    <br/><br/>
                </div>
            )
            break
        case 'Restore task':
            handleSubmit = handleRestoreSubmit
            formBody = (
                <div>
                    <h6> {t('modals.restoreTaskConfirm')} </h6>
                    <br/><br/>
                </div>
            )
            break
        case 'Quick Update':
            handleSubmit = handleEditSubmit
            break
        case 'Alternative Log In':
            handleSubmit = handleAltLoginSubmit
            break
        case 'Change Password':
            handleSubmit = handleChangePassSubmit
            break
        case 'Reset Password':
            handleSubmit = handleResetPassSubmit
            break
        default: 
            handleSubmit = handleEditSubmit
    }
    return (
    <div className="modal fade" id={id} tabIndex="-1" aria-labelledby={id+'Label'} aria-hidden="true">
        <div className="modal-dialog">
        <div className="modal-content bg-dark text-light">
        <div className="modal-header">
            <h1 className="modal-title fs-5" id={id+'Label'}>{translateItem(title, 'title', t)}</h1>
            <button type="button" className="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div className="modal-body">
            <form onSubmit={handleSubmit}>
                {formBody}
                <div className="modal-footer">
                    <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">{title ==='View Task'?t('common.close'):t('common.cancel')}</button>
                    {title !=='View Task' && <button type="submit" className={title.substring(0, 6)=== 'Delete'?"btn btn-danger":"btn btn-primary"} data-bs-dismiss="modal">{textMessage}</button>}
                </div>
            </form>
        </div>
        
        </div>
        </div>
    </div>
    )
}

export default FormModal