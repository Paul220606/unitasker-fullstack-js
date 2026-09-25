import * as bootstrap from 'bootstrap'
import { useState, useContext } from "react"
import { Link, useNavigate } from "react-router-dom"
import { useTranslation } from 'react-i18next'

import FormModal from "../../../shared/components/Form/FormModal"
import PinModal from "../components/PinModal"
import FormBuilder from "../../../shared/components/Form/FormBuilder"
import { login, guestLogin } from "../auth.api"
import { AppContext } from '../../../app/App'

function Login() {
    const { setUser, setCategoriesList } = useContext(AppContext)
    const navigate = useNavigate()
    const [showPassword, setShowPassword] = useState(false)
    const [userInfo, setUserInfo] = useState({})
    const {t} = useTranslation()
    const loginInputs = [
    {
        purpose: 'emailOrUsername',
        textMessage: t('auth.login.emailOrUsername'),
        type: 'text',
        placeholder: t('auth.login.emailOrUsernamePlaceholder'),
        required: true,
        col: 12
    },
    {
        purpose: 'password',
        textMessage: t('auth.login.password'),
        type: 'password',
        placeholder: t('common.placeholders.password'),
        showPassword,
        setShowPassword,
        required: true,
        col: 12
    }
    ]
    const showPinModal = (user, email, purpose = "resetPassword")=>{
        setUserInfo({userId: user, email, purpose})
        const pinModal = document.getElementById('otpModal')
        const modal = new bootstrap.Modal(pinModal)
        modal.show()
    }

    return (
        <div className="d-flex justify-content-center align-items-center p-4">
            <div className="card border-0 shadow-lg" style={{ width: "100%", maxWidth: "400px" }}>
                <FormBuilder 
                title="Log in" 
                inputs={loginInputs} 
                submitText={t('auth.login.title')}
                description={
                    <div>
                        {t('auth.login.notMember')}
                        <Link to="/register" className="fw-semibold text-decoration-none text-decoration-underline"> {t('auth.login.registerHere')}</Link>
                    </div>
                } 
                apiFunction={login}
                externalFunction={showPinModal}/>

                <div>
                    <button
                        className= "btn btn-outline-secondary w-100"
                        onClick={async () => {
                            try {
                                const res = await guestLogin()
                                if (res.success) {
                                    localStorage.setItem('token', res.token)
                                    localStorage.setItem('user', res.username)
                                    localStorage.setItem('categories', res.categories)
                                    setUser(res.username)
                                    setCategoriesList(res.categories)
                                    navigate('/')
                                }
                            } catch (err) {
                                console.log(err)
                            }
                        }}>
                            <i className='bi bi-eye me-2'></i>
                            {t('auth.login.tryAsGuest')}
                    </button>
                </div>
                <small className="text-center pb-3">
                    {t('auth.login.altLoginPrompt')} <Link 
                    data-bs-toggle="modal"
                    data-bs-target="#formModal" >{t('auth.login.clickHere')}</Link>
                </small>
            </div>
            <FormModal id="formModal" task={[]} title="Alternative Log In" textMessage={t('common.confirm')} fetchingFunction={showPinModal}/>
            <PinModal id='otpModal' {...userInfo} resFunction={()=>{
                const resetPassModal = document.getElementById('resetPassModal')
                const modal = new bootstrap.Modal(resetPassModal)
                modal.show()
            }}/>
            <FormModal id="resetPassModal" task={[]} title="Reset Password" textMessage={t('common.confirm')}/>
        </div>
    )
}

export default Login