import { useState } from "react"
import { Link } from "react-router-dom"
import { useTranslation } from "react-i18next"

import FormBuilder from "../../../shared/components/Form/FormBuilder"
import { register } from "../auth.api"

function Register() {
    const [showPassword1, setShowPassword1] = useState(false)
    const [showPassword2, setShowPassword2] = useState(false)
    const {t} = useTranslation()

    const registerInputs = [
  {
    purpose: 'fullName',
    textMessage: t('auth.register.fullName'),
    type: 'text',
    placeholder: t('common.placeholders.fullName'),
    required: true,
    col: 12
  },
  {
    purpose: 'username',
    textMessage: t('auth.register.username'),
    type: 'text',
    placeholder: t('common.placeholders.username'),
    required: true,
    col: 12
  },
  {
    purpose: 'email',
    textMessage: t('auth.register.email'),
    type: 'email',
    placeholder: t('common.placeholders.email'),
    required: true,
    col: 12
  },
  {
    purpose: 'phone',
    textMessage: t('auth.register.phone'),
    type: 'tel',
    placeholder: t('common.placeholders.phone'),
    required: true,
    col: 12
  },
  {
    purpose: 'location',
    textMessage: t('auth.register.location'),
    type: 'text',
    placeholder: t('common.placeholders.location'),
    required: false,
    col: 12
  },
  {
    purpose: 'password',
    textMessage: t('auth.register.password'),
    type: 'password',
    placeholder: t('common.placeholders.password'),
    required: true,
    showPassword: showPassword1,
    setShowPassword: setShowPassword1,
    col: 12
  },
  {
    purpose: 'confirmPassword',
    textMessage: t('auth.register.confirmPassword'),
    type: 'password',
    placeholder: t('common.placeholders.password'),
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
                submitText={t('auth.register.title')}
                description={
                    <div>
                        {t('auth.register.alreadyMember')}  
                        <Link to="/login" className="fw-semibold text-decoration-none text-decoration-underline"> {t('auth.register.loginHere')}</Link>
                    </div>
                }
                apiFunction={register}/>
            </div>
        </div>
    )
}

export default Register