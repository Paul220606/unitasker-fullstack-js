import { useRef, useState, useContext, useEffect } from "react"
import { useTranslation } from "react-i18next"
import {useNavigate} from "react-router-dom"

import { AppContext } from "../../../app/App"
import { checkPin, sendPin } from "../auth.api"
import { showToast } from "../../../shared/utils/toast"

const OTP_LENGTH = 6
const emptyOtp = () => Array(OTP_LENGTH).fill("")

function PinModal({id, userId, email, purpose="resetPassword", resFunction=()=>{}}) {
    const {loading, setLoading, setUser, setCategoriesList} = useContext(AppContext)
    const navigate = useNavigate()
    const [otp, setOtp] = useState(emptyOtp)
    const [submitting, setSubmitting] = useState(false)
    const {t} = useTranslation()
    const inputsRef = useRef([])
    const closeBtnRef = useRef(null)

    useEffect(() => {
        const modalEl = document.getElementById(id)
        if (!modalEl) return

        const handleModalShown = () => {
            setTimeout(() => {
                inputsRef.current[0]?.focus()
            }, 0)
        }

        modalEl.addEventListener('shown.bs.modal', handleModalShown)

        return () => {
            modalEl.removeEventListener('shown.bs.modal', handleModalShown)
        }
    }, [id])

    const closeModal = () => new Promise((resolve) => {
        const modalEl = document.getElementById(id)
        if (!modalEl || !closeBtnRef.current) return resolve()
        modalEl.addEventListener('hidden.bs.modal', resolve, { once: true })
        closeBtnRef.current.click()
    })

    const resetInputs = () => {
        setOtp(emptyOtp())
        inputsRef.current[0]?.focus()
    }

    const fillOtp = (text) => {
        const digits = text.replace(/\D/g, "").slice(0, OTP_LENGTH).split("")
        if (digits.length === 0) return
        const newOtp = emptyOtp()
        digits.forEach((d, i) => { newOtp[i] = d })
        setOtp(newOtp)
        inputsRef.current[Math.min(digits.length, OTP_LENGTH - 1)]?.focus()
    }

    const handleChange = (value, index) => {
        if (value.length > 1) {
            fillOtp(value)
            return
        }
        if (!/^\d?$/.test(value)) return

        const newOtp = [...otp]
        newOtp[index] = value
        setOtp(newOtp)

        if (value && index < OTP_LENGTH - 1) {
            inputsRef.current[index + 1].focus()
        }
    }

    const handleKeyDown = (e, index) => {
        if (e.key === "Backspace" && !otp[index] && index > 0) {
            inputsRef.current[index - 1].focus()
        }
        if (e.key === "Enter" && index === OTP_LENGTH - 1){
            handleSubmit()
        }
    }

    const handlePaste = (e) => {
        e.preventDefault()
        fillOtp(e.clipboardData.getData("text"))
    }

    const handleSubmit = async () => {
        const code = otp.join("")
        if (code.length !== OTP_LENGTH || submitting) return

        setSubmitting(true)
        try {
            const res = await checkPin({userId: userId, otp: code})
            if (!res.success) {
                showToast(res.state, res.message)
                resetInputs()
                return
            }

            if (res.token){
                localStorage.setItem('token', res.token)
                localStorage.setItem('user', res.username)
            }
            await closeModal()
            setOtp(emptyOtp())

            if (purpose === "twoFactor") {
                if (res.categories){
                    localStorage.setItem('categories', res.categories)
                    setCategoriesList(res.categories)
                }
                setUser(res.username)
                showToast(t('server.state.loginSuccess'), t('server.message.loggedIn'), 'success')
                navigate('/')
            } else {
                showToast(res.state, res.message, 'success')
                resFunction()
            }
        } catch (err) {
            console.error(err)
            showToast(t('common.error'), t('pin.unexpectedError'))
        } finally {
            setSubmitting(false)
        }
    }

    const handleResendOTP = async () => {
        setLoading(true)
        try {
            const res = await sendPin({data: {emailOrUsername: email}})
            if (res.success){
                showToast(res.state, res.message, 'success')
                resetInputs()
            } else {
                showToast(res.state, res.message)
            }
        } catch (err) {
            console.error(err)
            showToast(t('common.error'), t('pin.unexpectedError'))
        } finally {
            setLoading(false)
        }
    }

    const busy = loading || submitting

  return (
    <div className="modal fade" id={id} tabIndex="-1" aria-labelledby={id+'Label'} aria-hidden="true">
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content bg-dark text-light">

          <div className="modal-header border-secondary">
            <h2 className="modal-title fs-5" id={id+'Label'}>{t('pin.enterOtp')}</h2>
            <button
              ref={closeBtnRef}
              className="btn-close btn-close-white"
              data-bs-dismiss="modal"
              aria-label={t('common.close')}
            ></button>
          </div>

          <div className="modal-body text-center">

            <div
              className="d-flex justify-content-between gap-2"
              onPaste={handlePaste}
              role="group"
              aria-label={t('pin.enterOtp')}
            >
              {otp.map((digit, index) => (
                <input
                  key={index}
                  type="text"
                  inputMode="numeric"
                  autoComplete={index === 0 ? "one-time-code" : "off"}
                  aria-label={t('pin.digitLabel', {index: index + 1, total: OTP_LENGTH})}
                  className="form-control text-center bg-secondary text-light border-0"
                  style={{ width: "50px", height: "55px", fontSize: "20px" }}
                  value={digit}
                  onChange={(e) => handleChange(e.target.value, index)}
                  onKeyDown={(e) => handleKeyDown(e, index)}
                  ref={(el) => (inputsRef.current[index] = el)}
                />
              ))}
            </div>

            <div className="d-flex gap-2 mt-4">

                <button
                type="button"
                className="btn btn-secondary"
                data-bs-dismiss="modal"
                data-bs-toggle="modal"
                data-bs-target="#formModal"
                >
                <i className="bi bi-arrow-left me-1" aria-hidden="true"></i>
                {t('pin.back')}
                </button>

                <button
                type="button"
                className="btn btn-outline-light flex-grow-1"
                onClick={handleResendOTP}
                disabled={busy}
                >
                <i className="bi bi-arrow-clockwise me-1" aria-hidden="true"></i>
                {t('pin.resend')}
                </button>

                <button
                type="button"
                className="btn btn-primary flex-grow-1"
                onClick={handleSubmit}
                disabled={busy || otp.join("").length !== OTP_LENGTH}
                >
                {submitting ? t('pin.verifying') : t('pin.confirm')}
                </button>
            </div>

            </div>

        </div>
      </div>
    </div>
  );
}

export default PinModal;