import {Toast as BsToast} from "react-bootstrap"

function Toast({show, title, message, type='danger', onClose}) {
   return(
        <BsToast 
        show={show} 
        onClose={onClose}
        delay={3000}
        autohide
        bg={type}
        className="mb-2"
        animation={true}>
            <BsToast.Header closeButton={true}>
                <strong className="me-auto">{title}</strong>
            </BsToast.Header>
            <BsToast.Body className="text-white">
                {message}
            </BsToast.Body>
        </BsToast>
        
   )
   
}

export default Toast