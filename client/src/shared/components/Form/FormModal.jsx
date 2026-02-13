import { useState, useEffect } from "react"

import FormFields from "./FormFields"
import convertDateTimeInput from "../../utils/convertDateTimeInput"
import { createInputObject, createNullInputObject } from "../../utils/createInitialState"
import { validateAllInputs } from "../../utils/validateInput"
import { showToast } from "../../utils/toast"
import { editTask, deleteTask, deleteTaskPermanent, restoreTask } from "../../../features/tasks/task.api"

function FormModal({id, task, textMessage, title, fetchingFunction}){
    const dueDateIsNull = (task.dueDate && task.dueDate !== 'None')
    const taskInputs = [
  {
    purpose: 'title',
    textMessage: 'Task Title',
    type: 'text',
    value: task.title || '',
    required: true,
    col: 12
  },
  {
    purpose: 'description',
    textMessage: 'Task Description',
    component: 'textarea',
    value: task.description || '',
    required: false,
    col: 12
  },
  {
    purpose: 'budget',
    textMessage: 'Budget ($)',
    type: 'number',
    value: task.budget || '0',
    required: false,
    col: 6
  },
  {
    purpose: 'status',
    textMessage: 'Status',
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
  ... ((title !=='View task' || dueDateIsNull)?
  [{
    purpose: 'dueDate',
    textMessage: 'Due Date',
    type: 'datetime-local',
    value: dueDateIsNull?convertDateTimeInput(task.dueDate) :'',
    col: 12
  }]:[]),
  {
    purpose: 'category',
    textMessage: 'Category',
    component: 'select',
    value: task.category || 'Other',
    required: true,
    options: [
      'Housework',
      'Schoolwork',
      'Job',
      'Other',
    ],
    col: 12
  }, 
  ]
    const [data, setData] = useState(()=> (createInputObject(taskInputs)))
    const [errors, setErrors] = useState(()=> (createNullInputObject(taskInputs)))
    useEffect(()=> {
      setData(createInputObject(taskInputs))
      setErrors(createNullInputObject(taskInputs))  
    }, [task])
    
    const handleEditSubmit = async (e) => {
        e.preventDefault()
        const newErrors = validateAllInputs(taskInputs, data, setErrors, false)
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

    const handleRestoreSubmit = async (e) => {
        e.preventDefault()
        try {
            const res = await restoreTask({taskNumber: task.id, status: task.status})
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

    const handleDeleteSubmit = async (e) => {
        e.preventDefault()
        try {
            const res = await deleteTask({taskNumber: task.id, status: task.status})
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

    let handleSubmit, formBody
    switch (title){
        case 'Delete task': 
            handleSubmit = handleDeleteSubmit
            formBody = (
                <div>
                    <h6> Are you sure you want to delete this task? </h6>
                    <br /><br />
                </div>
            )
            break
        case 'Delete permanently':
            handleSubmit = handlePermanentDeleteSubmit
            formBody = (
                <div>
                    <h6> Clicking confirm means that you can not access this data again anymore </h6>
                    <br/><br/>
                </div>
            )
            break
        case 'Restore task':
            handleSubmit = handleRestoreSubmit
            formBody = (
                <div>
                    <h6> Are you sure you want to restore this task? </h6>
                    <br/><br/>
                </div>
            )
            break
        default: 
            handleSubmit = handleEditSubmit 
            formBody = <FormFields inputs={taskInputs} title={title} data={data} setData={setData} errors={errors} setErrors={setErrors}/>
    }
    return (
    <div className="modal fade" id={id} tabIndex="-1" aria-labelledby={id+'Label'} aria-hidden="true">
        <div className="modal-dialog">
        <div className="modal-content bg-dark text-light">
        <div className="modal-header">
            <h1 className="modal-title fs-5" id={id+'Label'}>{title}</h1>
            <button type="button" className="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div className="modal-body">
            <form onSubmit={handleSubmit}>
                {formBody}
                <div className="modal-footer">
                    <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">{title ==='View task'?'Close':'Cancel'}</button>
                    {title ==='View task' || <button type="submit" className={title.substring(0, 6)=== 'Delete'?"btn btn-danger":"btn btn-primary"} data-bs-dismiss="modal">{textMessage}</button>}
                </div>
            </form>
        </div>
        
        </div>
        </div>
    </div>
    )
}

export default FormModal