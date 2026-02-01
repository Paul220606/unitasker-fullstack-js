import { useState } from "react"

import AuthForm from "../components/AuthForm"
import { login } from "../auth.api"

function Login() {
    const [showPassword, setShowPassword] = useState(false)
    const inputs = [
        {
            purpose: 'emailOrUsername',
            textMessage: 'Email or username',
            type: 'text'
        }, 
        {
            purpose: 'password',
            textMessage: 'Password',
            type: 'password',
            showPassword,
            setShowPassword,
        }
    ]
    return (
        <div className="d-flex justify-content-center align-items-center p-4">
            <div className="card border-0 shadow-lg" style={{ width: "400px" }}>
                <AuthForm title="Log in" inputs={inputs} submitText="Log in" apiFunction={login}/>
            </div>
        </div>
    )
}

export default Login