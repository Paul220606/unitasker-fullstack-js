import {toast} from 'react-toastify'

export const showToast = (title, message, type = 'error') => {
    toast[type](
        <div>
            <strong style={{display: 'block'}}>{title}</strong>
            <span>{message}</span>
        </div>
    )
}