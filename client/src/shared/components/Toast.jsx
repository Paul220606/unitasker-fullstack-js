import {Toast as BsToast} from "bootstrap"
import { useRef, useEffect } from "react"


function Toast({show, title, message, type='danger', onClose}) {
    const toastRef = useRef(null)

    useEffect(()=>{
        if (show && toastRef.current) {
            const toast = new BsToast(toastRef.current, {
                delay: 3000,
                autohide: true,
            })
            toast.show()

            toastRef.current.addEventListener("hidden.bs.toast", () => {
                if (onClose) onClose()
            })
        }
    }, [show, onClose])

    return (
        <div ref={toastRef} className={`toast align-items-center text-bg-${type} border-0 mb-2`} role="alert" aria-live="assertive" aria-atomic="true">
            <div className="d-flex">
                <div className="toast-body">
                    <b>{title}:</b> <i>{message}</i>
                </div>
                <button type="button" className="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>
            </div>
        </div>
    )
}

export default Toast