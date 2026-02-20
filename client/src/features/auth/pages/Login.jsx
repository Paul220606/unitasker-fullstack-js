import * as bootstrap from 'bootstrap'
import { useState } from "react"
import { Link } from "react-router-dom"

import FormModal from "../../../shared/components/Form/FormModal"
import PinModal from "../components/PinModal"
import FormBuilder from "../../../shared/components/Form/FormBuilder"
import { login } from "../auth.api"

function Login() {
    const [showPassword, setShowPassword] = useState(false)
    const [userInfo, setUserInfo] = useState({})
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
                <small className="text-center pb-3">
                    Another way to log in? <Link 
                    data-bs-toggle="modal"
                    data-bs-target="#formModal" >Click here</Link>
                </small>
            </div>
            <FormModal id="formModal" task={[]} title="Alternative Log In" textMessage="Confirm" fetchingFunction={(user, email)=>{
                setUserInfo({userId: user, email})
                const pinModal = document.getElementById('otpModal')
                const modal = new bootstrap.Modal(pinModal)
                modal.show()
            }}/>
            <PinModal id='otpModal' {...userInfo}/>
        </div>
    )
}

export default Login