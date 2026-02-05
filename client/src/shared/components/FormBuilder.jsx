import { useState, useContext, useRef } from "react"
import {useNavigate} from "react-router-dom"

import '../../styles/form.scss'
import { AppContext } from "../../app/App.jsx"
import { createInputObject } from "../utils/createInitialState.js"
import { showToast } from "../utils/toast.jsx"
import { confirmPasswordRule, validateAllInputs, validateInput} from "../utils/validateInput.js"

function FormBuilder({ title, description, inputs, submitText, apiFunction}) {
    const navigate = useNavigate()
    const inputRefs = useRef([])
    const {setUser} = useContext(AppContext)
    const [data, setData] = useState(()=> (createInputObject(inputs)))
    const [errors, setErrors] = useState(()=> (createInputObject(inputs)))

    const handleChange = (e, type, textMessage, required) => {
        const {id, value} = e.target
        const nextData = {...data, [id]: value}
        setData(nextData)
        if (!required) return
        let err
        if (title=== 'Register'){
            if (id=="confirmPassword"){
                err = validateInput(type, value, textMessage, confirmPasswordRule(nextData.password))
            } else {
                err = validateInput(type, value, textMessage)
            }
        } else {
            err = validateInput('required', value, textMessage)
        }
        setErrors(prev => ({
            ...prev,
            [id]: err
        }))
    }

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
                localStorage.setItem('token', res.token)
                localStorage.setItem('user', res.username)
                setUser(res.username)
                navigate('/')
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

            <div className="row px-4 py-2">
                {inputs.map((input, index) => {
                    const isPassword = input.type == 'password'
                    const Component = input.component || 'input'
                    const colClass = `col-md-${input.col || 12} mb-3 input-animate`
                    return (
                        <div className={colClass} key={index}>
                            <label htmlFor={input.purpose} className="form-label">{input.textMessage+':'}</label>
                            <div className="input-group">
                                {   
                                    input.component === 'select'?
                                    <select className={"form-select " + (errors[input.purpose]?'is-invalid':'')} >
                                        <option disabled defaultChecked>{'Choose a ' + input.textMessage.toLowerCase()}</option>
                                        {input.options.map((option, index)=><option key={index} value={option.toLowerCase()}>{option}</option>)}
                                    </select>
                                    :
                                    <Component
                                    ref={(el)=>(inputRefs.current[index] = el)}
                                    type={isPassword?(input.showPassword?'text':'password'):input.type} 
                                    className={"form-control " + (errors[input.purpose]?'is-invalid':'')} 
                                    id={input.purpose} 
                                    value={data[input.purpose]} 
                                    onChange={ (e)=> handleChange(e, input.type, input.textMessage, input.required)}
                                    autoFocus={inputs.indexOf(input) == 0}
                                    onKeyDown={(e) => {
                                        const nextInput = inputRefs.current[index + 1]
                                        if (e.key === "Enter" && nextInput) {
                                            e.preventDefault()
                                            handleChange(e, input.type, input.textMessage, input.required)
                                            nextInput.focus()
                                        }
                                    }}/>
                                }
                                {isPassword && 
                                <button type="button" className="btn btn-dark" onClick={()=>{input.setShowPassword(prev=>!prev)}}>
                                    <i className={input.showPassword?"bi bi-eye-fill":"bi bi-eye-slash-fill"}></i>
                                </button>}
                            </div>
                            {(errors[input.purpose] && (
                                <div className="text-danger mt-1">{errors[input.purpose]}</div>
                            ))}
                        </div>
                    )
                })}
                <div className="d-flex justify-content-end gap-2">
                    <button type="button" className="btn btn-outline-secondary" onClick={() => {window.location.href='/'}}>
                    Cancel
                    </button>
                    <button type="submit" className="btn btn-primary px-4">
                    {submitText}
                    </button>
                </div>
            </div>
        </form>
    )
}

export default FormBuilder