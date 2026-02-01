import { useState, useContext, useRef } from "react"
import {useNavigate} from "react-router-dom"

import { AppContext } from "../../../app/App"
import { createInputObject } from "../../../shared/utils/createInitialState"
import { confirmPasswordRule, validateAllInputs, validateInput} from "../../../shared/utils/validateInput"

function AuthForm({ title, inputs, submitText, apiFunction}) {
    const navigate = useNavigate()
    const inputRefs = useRef([])
    const {showToast, setUser} = useContext(AppContext)
    const [data, setData] = useState(()=> (createInputObject(inputs)))
    const [errors, setErrors] = useState(()=> (createInputObject(inputs)))

    const handleChange = (e, type, textMessage) => {
        const {id, value} = e.target
        const nextData = {...data, [id]: value}
        setData(nextData)
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
            newErrors = validateAllInputs(inputs, data, setErrors)
        } else {
            newErrors = validateAllInputs(inputs, data, setErrors)
        }

        let skip = false
        Object.entries(newErrors).forEach((arr)=>{
            const err = arr[1]
            if (err){
                showToast('Invalid field(s)', err, 'warning')
                skip = true
            }
        })
        if (skip) {return}
        try {
            const res = await apiFunction(data)
            if (res.success){
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
        <form onSubmit={handleSubmit}>
            <div className="bg-dark text-white text-center py-3 rounded">
                <h1 className="m-0">{title}</h1>
            </div>

            <div className="p-4">
                {inputs.map((input, index) => {
                    const isPassword = input.type == 'password'
                    return (
                        <div className="mb-3" key={index}>
                            <label htmlFor={input.purpose} className="form-label">{input.textMessage+':'}</label>
                            <div className="input-group">
                                <input
                                ref={(el)=>(inputRefs.current[index] = el)}
                                type={isPassword?(input.showPassword?'text':'password'):input.type} 
                                className={"form-control " + (errors[input.purpose]?'is-invalid':'')} 
                                id={input.purpose} 
                                value={data[input.purpose]} 
                                onChange={(e)=> handleChange(e, input.type, input.textMessage)}
                                onKeyDown={(e) => {
                                    const nextInput = inputRefs.current[index + 1]
                                    if (e.key === "Enter" && nextInput) {
                                        e.preventDefault()
                                        nextInput.focus()
                                    } 
                                }}/>
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
                <div className="d-flex justify-content-end">
                    <button type="submit" className="btn btn-dark">{submitText}</button>
                </div>
            </div>
        </form>
    )
}

export default AuthForm