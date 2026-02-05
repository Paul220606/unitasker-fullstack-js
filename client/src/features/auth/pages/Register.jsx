import { useState } from "react"

import FormBuilder from "../../../shared/components/FormBuilder"
import { register } from "../auth.api"

function Register() {
    const [showPassword1, setShowPassword1] = useState(false)
    const [showPassword2, setShowPassword2] = useState(false)

    const registerInputs = [
  {
    purpose: 'username',
    textMessage: 'Username',
    type: 'text',
    required: true,
    col: 12
  },
  {
    purpose: 'email',
    textMessage: 'Email',
    type: 'email',
    required: true,
    col: 12
  },
  {
    purpose: 'password',
    textMessage: 'Password',
    type: 'password',
    required: true,
    showPassword: showPassword1,
    setShowPassword: setShowPassword1,
    col: 6
  },
  {
    purpose: 'confirmPassword',
    textMessage: 'Confirm password',
    type: 'password',
    required: true,
    showPassword: showPassword2,
    setShowPassword: setShowPassword2,
    col: 6
  }
]


    return (
        <div className="d-flex justify-content-center align-items-center p-4">
            <div className="card border-0 shadow-lg" style={{ width: "400px" }}>
                <FormBuilder title="Register" inputs={registerInputs} submitText="Register" apiFunction={register}/>
            </div>
        </div>
    )
}

export default Register