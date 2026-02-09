import { useState } from "react"
import { Link } from "react-router-dom"

import FormBuilder from "../../../shared/components/Form/FormBuilder"
import { register } from "../auth.api"

function Register() {
    const [showPassword1, setShowPassword1] = useState(false)
    const [showPassword2, setShowPassword2] = useState(false)

    const registerInputs = [
  {
    purpose: 'username',
    textMessage: 'Username',
    type: 'text',
    placeholder: 'e.g. paul1234',
    required: true,
    col: 12
  },
  {
    purpose: 'email',
    textMessage: 'Email',
    type: 'email',
    placeholder: 'e.g. paul@gmail.com',
    required: true,
    col: 12
  },
  {
    purpose: 'password',
    textMessage: 'Password',
    type: 'password',
    placeholder: 'e.g. Paul123!',
    required: true,
    showPassword: showPassword1,
    setShowPassword: setShowPassword1,
    col: 12
  },
  {
    purpose: 'confirmPassword',
    textMessage: 'Confirm password',
    type: 'password',
    placeholder: 'e.g. Paul123!',
    required: true,
    showPassword: showPassword2,
    setShowPassword: setShowPassword2,
    col: 12
  }
]


    return (
        <div className="d-flex justify-content-center align-items-center p-4">
            <div className="card border-0 shadow-lg" style={{ width: "400px" }}>
                <FormBuilder 
                title="Register" 
                inputs={registerInputs} 
                submitText="Register" 
                description={
                    <div>
                        Already a member?  
                        <Link to="/login" className="fw-semibold text-decoration-none text-decoration-underline"> Log in here</Link>
                    </div>
                }
                apiFunction={register}/>
            </div>
        </div>
    )
}

export default Register