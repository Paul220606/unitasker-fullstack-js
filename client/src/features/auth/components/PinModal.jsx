import { useRef, useState, useContext, useEffect } from "react"
import { useNavigate } from "react-router-dom"

import { AppContext } from "../../../app/App"
import { checkPin, sendPin } from "../auth.api"
import { showToast } from "../../../shared/utils/toast"
function PinModal({id, userId, email}) {
    const {loading, setLoading, setUser} = useContext(AppContext)
    const [otp, setOtp] = useState(["", "", "", "", "", ""])
    const navigate = useNavigate()
    const inputsRef = useRef([])
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
    const handleChange = (value, index) => {
        if (!/^\d?$/.test(value)) return

        const newOtp = [...otp]
        newOtp[index] = value
        setOtp(newOtp)

        if (value && index < 5) {
        inputsRef.current[index + 1].focus()
        }
    }

    const handleKeyDown = (e, index) => {
        if (e.key === "Backspace" && !otp[index] && index > 0) {
            inputsRef.current[index - 1].focus()
        }
        if (e.key === "Enter" && index === otp.length -1){
            handleSubmit()
        }
    }

    const handlePaste = (e) => {
        const pasteData = e.clipboardData.getData("text").slice(0, 6);
        if (!/^\d+$/.test(pasteData)) return

        const newOtp = pasteData.split("")
        setOtp(newOtp);

        newOtp.forEach((_, i) => {
        if (inputsRef.current[i]) {
            inputsRef.current[i].value = newOtp[i]
        }
        })

    inputsRef.current[5].focus()
  };

  const handleSubmit = async () => {
    console.log(userId)
    const code = otp.join("");
    if (code.length === 6) {
        const res = await checkPin({userId: userId, otp: code})
        if (res.success){
            showToast(res.state, res.message, 'success')
            if (res.token){
                localStorage.setItem('token', res.token)
                localStorage.setItem('user', res.username)
                setUser(res.username)
            }
            navigate('/')
        } else {
            showToast(res.state, res.message)
        }
    }
  }

  const handleResendOTP = async () => {
        setLoading(true)
        try {
            const res = await sendPin({data: {emailOrUsername: email}})
            if (res.success){
                showToast(res.state, res.message, 'success')
                setOtp(["", "", "", "", "", ""])
                inputsRef.current[0]?.focus()
            } else {
                showToast(res.state, res.message)
            }
        } catch (err) {
            throw err
        } finally {
            setLoading(false)
        }
    }

  return (
    <div className="modal fade" id={id} tabIndex="-1" aria-labelledby={id+'Label'} aria-hidden="true">
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content bg-dark text-light">

          <div className="modal-header border-secondary">
            <h5>Enter OTP Code</h5>
            <button
              className="btn-close btn-close-white"
              data-bs-dismiss="modal"
            ></button>
          </div>

          <div className="modal-body text-center">

            <div
              className="d-flex justify-content-between gap-2"
              onPaste={handlePaste}
            >
              {otp.map((digit, index) => (
                <input
                  key={index}
                  type="text"
                  maxLength={1}
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
                <i className="bi bi-arrow-left me-1"></i>
                Back
                </button>

                <button
                className="btn btn-outline-light flex-grow-1"
                onClick={handleResendOTP}
                disabled={loading}
                >
                <i className="bi bi-arrow-clockwise me-1"></i>
                Resend OTP
                </button>

                <button
                className="btn btn-primary flex-grow-1"
                onClick={handleSubmit}
                data-bs-dismiss="modal"
                disabled={loading}
                >
                {loading ? 'Verifying...' : 'Confirm'}
                </button>
            </div>

            </div>

        </div>
      </div>
    </div>
  );
}

export default PinModal;
