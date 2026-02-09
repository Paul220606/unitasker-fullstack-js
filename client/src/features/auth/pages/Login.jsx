import { useState } from "react"
import { Link } from "react-router-dom"

import FormBuilder from "../../../shared/components/Form/FormBuilder"
import { login } from "../auth.api"

function Login() {
    const [showPassword, setShowPassword] = useState(false)
    const loginInputs = [
  {
    purpose: 'emailOrUsername',
    textMessage: 'Email or username',
    type: 'text',
    placeholder: 'e.g. paul1234',
    required: true,
    col: 12
  },
  {
    purpose: 'password',
    textMessage: 'Password',
    type: 'password',
    placeholder: 'e.g. Paul123!',
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
                        Not a member?  
                        <Link to="/register" className="fw-semibold text-decoration-none text-decoration-underline"> Register here</Link>
                    </div>
                } 
                apiFunction={login}/>
            </div>
        </div>
    )
}

export default Login