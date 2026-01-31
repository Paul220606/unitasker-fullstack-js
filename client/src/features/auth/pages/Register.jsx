import { useState } from "react"

import AuthForm from "../components/AuthForm"
import { register } from "../auth.api"

function Register() {
    const [showPassword1, setShowPassword1] = useState(false)
    const [showPassword2, setShowPassword2] = useState(false)

    const inputs = [
        {
            purpose: 'username',
            textMessage: 'Username',
            type: 'text'
        },
        {
            purpose: 'email',
            textMessage: 'Email',
            type: 'email'
        }, 
        {
            purpose: 'password',
            textMessage: 'Password',
            type: 'password',
            showPassword: showPassword1,
            setShowPassword: setShowPassword1
        },
        {
            purpose: 'confirmPassword',
            textMessage: 'Confirm password',
            type: 'password',
            showPassword: showPassword2,
            setShowPassword: setShowPassword2
        }
    ]

    return (
        <div className="d-flex justify-content-center align-items-center p-4">
            <div className="card border-0 shadow-lg" style={{ width: "400px" }}>
                <AuthForm title="Register" inputs={inputs} submitText="Register" apiFunction={register}/>
            </div>
        </div>
    )
}

export default Register