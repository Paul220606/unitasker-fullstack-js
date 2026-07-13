import {toast} from 'react-toastify'
import i18n from '../../i18n'
import translateItem from './translateItem'

export const showToast = (title, message, type = 'error') => {

    toast[type](
        <div>
            <strong style={{display: 'block'}}>{translateItem(title, 'message', i18n.t)}</strong>
            <span>{translateItem(message, 'message', i18n.t)}</span>
        </div>
    )
}