import { useRef } from "react"
import { confirmPasswordRule, validateInput} from "../../utils/validateInput.js"

function FormFields({inputs, errors, setErrors, data, setData, title}) {
    const inputRefs = useRef([])

    const handleChange = (e, type, textMessage, required) => {
        const {id, value, checked} = e.target
        const inputValue = (type === 'checkbox' || type === 'radio') ? checked : value
        const nextData = {...data, [id]: inputValue}
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
    return (
        <div className="row px-4 py-2">
            {inputs.map((input, index) => {      
                const isPassword = input.type == 'password'
                const Component = input.component || 'input'
                const colClass = `col-md-${input.col || 12} mb-3 input-animate`

                return (
                    <div key={index} className={colClass}>
                        {(input.type === 'checkbox' || input.type === 'radio') ||
                            <label htmlFor={input.purpose} className="form-label">
                                {input.textMessage + ':'}
                            </label>}

                        <div className="input-group">
                            {input.component === 'select' ? (
                                <select
                                    id={input.purpose}
                                    value= {data[input.purpose]}
                                    {...title ==='View task'?{className: "form-select", disabled: true}:{className: ("form-select " + (errors[input.purpose] ? 'is-invalid' : '')), onChange: (e) => handleChange(e, input.type, input.textMesage, input.required)}}
                                >
                                    {title ==='View task'?
                                    input.options.map((option, i) =>
                                        <option key={i} value={option}>{option}</option>
                                    )
                                    : 
                                    <>
                                    <option value="" disabled defaultChecked>
                                        {'Choose a ' + input.textMessage.toLowerCase()}
                                    </option>
                                    {input.options.map((option, i) =>
                                        <option key={i} value={option}>{option}</option>
                                    )}
                                    </>}
                                    
                                </select>
                            ) : (
                                <Component
                                    type={isPassword ? (input.showPassword ? 'text' : 'password') : input.type}
                                    id={input.purpose}
                                    {... input.type === 'checkbox' || input.type === 'radio'
                                            ? { checked: data[input.purpose] || false }
                                            : { value: data[input.purpose] || "" }}
                                    {...title ==='View task'?
                                        {
                                            className: ((input.type === "checkbox" || input.type === "radio" ? "form-check-input" : "form-control ")+ " rounded"),
                                            disabled: true
                                        }
                                        :
                                        {
                                            ref: (el)=>(inputRefs.current[index]= el),
                                            className: ((input.type === "checkbox" || input.type === "radio" ? "form-check-input" : "form-control ")+ (errors[input.purpose] ? 'is-invalid' : '') + " rounded"),
                                            placeholder: input.placeholder,
                                            onKeyDown: (e) => { 
                                                const nextInput = inputRefs.current[index + 1] 
                                                if (e.key === "Enter" && nextInput) { 
                                                    e.preventDefault() 
                                                    handleChange(e, input.type, input.textMessage, input.required) 
                                                    nextInput.focus() }},
                                            autoFocus: inputs.indexOf(input) == 0,
                                            onChange: (e) => handleChange(e, input.type, input.textMessage, input.required)
                                        }
                                    }
                                />
                            )}
                            {(input.type === 'checkbox' || input.type === 'radio') && <label htmlFor={input.purpose} className="form-label ms-1">{input.textMessage}</label>}
                            {isPassword && <button type="button" className="btn btn-dark" onClick={()=>{input.setShowPassword(prev=>!prev)}}> <i className={input.showPassword?"bi bi-eye-fill":"bi bi-eye-slash-fill"}></i> </button>}
                        </div>
                        
                        {title ==='View task' || (errors[input.purpose] && (
                            <div className="text-danger mt-1">{errors[input.purpose]}</div>
                        ))}
                    </div>
                )
            })}
            
        </div>
    )
}

export default FormFields
