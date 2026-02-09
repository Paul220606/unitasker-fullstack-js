function FormModal({id, task, readOnly}){
    return (
    <div className="modal fade" id={id} tabIndex="-1" aria-labelledby={id+'Label'} aria-hidden="true">
        <div className="modal-dialog">
        <div className="modal-content bg-dark text-light">
        <div className="modal-header">
            <h1 className="modal-title fs-5" id={id+'Label'}>Task View</h1>
            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div className="modal-body">
            <form>
            <div className="mb-3">
            <label htmlFor="title-name" className="col-form-label">Title:</label>
            <input type="text" className="form-control bg-dark text-light border-secondary" id="recipient-name" value={task.title || ''} {...(readOnly?{disabled:true}:{})}/>
            </div>
            <div className="mb-3">
            <label htmlFor="message-text" className="col-form-label">Description:</label>
            <textarea className="form-control bg-dark text-light border-secondary" id="message-text" value={task.description || ''} {...(readOnly?{disabled:true}:{})}></textarea>
            </div>
            </form>
        </div>
        <div className="modal-footer">
            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
            <button type="button" className="btn btn-primary">Send message</button>
        </div>
        </div>
        </div>
    </div>
    )
}

export default FormModal