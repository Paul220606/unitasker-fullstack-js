import { useState, useContext } from "react"
import {useNavigate} from "react-router-dom"

import { ToastContext } from "../../../app/App"
import { createInitialStateObject } from "../../../shared/utils/createInitialState"
import validateInput from "../../../shared/utils/validateInput"

function AuthForm({ title, inputs, submitText, apiFunction}) {
    const navigate = useNavigate()
    const {showToast} = useContext(ToastContext)
    const [errors, setErrors] = useState(()=> (createInitialStateObject(inputs)))
    const [data, setData] = useState(()=> (createInitialStateObject(inputs)))

    const handleChange = (e, type, textMessage) => {
        const {id, value} = e.target

        setData(prev => ({
            ...prev,
            [id]: value
        }))

        let err = null
        if (id=="confirmPassword"){
            err = validateInput(type, value, textMessage, {
                validator: (val) => val.trim() === data['password'].trim(),
                messageRender: (textMessage) => textMessage + ' must be matched with the password above.'
            })
        } else {
            err = validateInput(type, value, textMessage)
        }

        setErrors(prev => ({
            ...prev,
            [id]: err
        }))
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        let skip = false
        Object.entries(errors).forEach((arr)=>{
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
                navigate('/')
            } else {
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
                        <div key={index} className="mb-3">
                            <label htmlFor={input.purpose} className="form-label">{input.textMessage+':'}</label>
                            <div className="input-group">
                                <input type={isPassword?(input.showPassword?'text':'password'):input.type} className={"form-control " + (errors[input.purpose]?'is-invalid':'')} id={input.purpose} value={data[input.purpose]} onChange={(e)=> handleChange(e, input.type, input.textMessage)}/>
                                {isPassword && 
                                <button type="button" className="btn btn-dark" onClick={()=>{input.setShowPassword(prev=>!prev)}}>
                                    <i className={input.showPassword?"bi bi-eye-fill":"bi bi-eye-slash-fill"}></i>
                                </button>}
                            </div>
                            {errors[input.purpose] && (
                                <div className="text-danger mt-1">{errors[input.purpose]}</div>
                            )}
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