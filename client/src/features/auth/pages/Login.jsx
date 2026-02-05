import { useState } from "react"
import { Link } from "react-router-dom"

import FormBuilder from "../../../shared/components/FormBuilder"
import { login } from "../auth.api"

function Login() {
    const [showPassword, setShowPassword] = useState(false)
    const loginInputs = [
  {
    purpose: 'emailOrUsername',
    textMessage: 'Email or username',
    type: 'text',
    required: true,
    col: 12
  },
  {
    purpose: 'password',
    textMessage: 'Password',
    type: 'password',
    showPassword,
    setShowPassword,
    required: true,
    col: 12
  }
]

    return (
        <div className="d-flex justify-content-center align-items-center p-4">
            <div className="card border-0 shadow-lg" style={{ width: "400px" }}>
                <FormBuilder 
                title="Log in" 
                inputs={loginInputs} 
                submitText="Log in" 
                description={
                    <div>
                        Already a member?  
                        <Link to="/login" className="fw-semibold text-decoration-none text-decoration-underline"> Log in here</Link>
                    </div>
                } 
                apiFunction={login}/>
            </div>
        </div>
    )
}

export default Login