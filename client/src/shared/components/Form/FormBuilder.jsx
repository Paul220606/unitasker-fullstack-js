

import {useNavigate} from "react-router-dom"
import { useState, useContext } from "react"

import '../../../styles/form.scss'
import FormFields from "./FormFields.jsx"
import { AppContext } from "../../../app/App.jsx"
import { showToast } from "../../utils/toast.jsx"
import { validateAllInputs} from "../../utils/validateInput.js"
import { createInputObject, createNullInputObject } from "../../utils/createInitialState.js"


function FormBuilder({ title, description, inputs, submitText, apiFunction}) {
    const {setUser} = useContext(AppContext)
    const [data, setData] = useState(()=> (createNullInputObject(inputs)))
    const [errors, setErrors] = useState(()=> (createNullInputObject(inputs)))
    const navigate = useNavigate()
    const handleSubmit = async (e) => {
        e.preventDefault()
        let newErrors
        if (title === 'Register'){
            newErrors = validateAllInputs(inputs, data, setErrors, true)
        } else {
            newErrors = validateAllInputs(inputs, data, setErrors, false)
        }

        let skip = false
        Object.entries(newErrors).forEach((arr)=>{
            const err = arr[1]
            if (err){
                showToast('Invalid field(s)', err, 'warning')
                skip = true
            }
        })
        if (skip) {
            return
        }
        try {
            const res = await apiFunction(data)
            if (res.success){
                showToast(res.state, res.message, 'success')
                if (res.token){
                    localStorage.setItem('token', res.token)
                    localStorage.setItem('user', res.username)
                    setUser(res.username)
                }
                navigate(-1)
            } else {
                if (title === 'Log in') setErrors(createInputObject(inputs, res.message))
                showToast(res.state, res.message)
            }
        }
        catch (err){
            throw err
        }
    }
    return (
        <form onSubmit={handleSubmit} className="auth-form fade-in-up">
            <div className="bg-dark text-white text-center py-3 rounded-top">
              <h3 className="m-0 fw-bold">{title}</h3>
              <small className="text-secondary">
                {description}
              </small>
            </div>
            <FormFields inputs={inputs} errors = {errors} setErrors={setErrors} data={data} setData={setData} title={title} readOnly={false}/>  
            <div className="d-flex justify-content-end gap-2 px-4 pb-3">
                <button
                    type="button"
                    className="btn btn-outline-secondary"
                    onClick={() => { navigate(-1)}}
                >
                    Cancel
                </button>
                <button type="submit" className="btn btn-dark px-4">
                    {submitText}
                </button>
            </div>  
        </form>
    )
}

export default FormBuilder