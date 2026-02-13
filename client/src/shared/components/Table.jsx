function Table({title, stats=[], tasks=[], buttonsData=[], noDataMessage, modalFunc}) {
    return (
        <div className="card bg-dark text-light shadow-sm mb-3">
            <div className="card-header">
                <h5>{title}</h5>
            </div>
            <div className="card-body">
                <table className="table table-dark table-hover">
                    <thead>
                        <tr>
                            <th>#</th>
                            {stats.map((title, index)=><th key={index}>{title}</th>)}
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                        tasks.length > 0 ?
                        tasks.map((task)=>(
                            <tr key={task.displayedStats[0]}>
                                {task.displayedStats.map((taskStat, index)=>(
                                    <td key={index}>
                                        {stats[index-1]==='Status'?
                                        <span className={`badge ${taskStat === "Completed" ? "bg-success" : taskStat === "Pending" ? "bg-warning" : taskStat === "Canceled"? "bg-danger" : "bg-primary"}`}>
                                        {taskStat}
                                        </span>: <div>{taskStat}</div>}
                                    </td>
                                ))}
                                <td>
                                    <div className="btn-group btn-group-sm">
                                        {buttonsData.map((btn, i)=>(
                                            <button
                                            key={i} 
                                            type="button"
                                            className={`btn btn-outline-${btn.type}`}
                                            data-bs-toggle="modal"
                                            data-bs-target="#formModal"
                                            onClick={(()=>modalFunc({task : task.allStats, title: btn.modalTitle, textMessage: btn.modalMessage}))}>
                                                {btn.content}
                                            </button>
                                        ))}
                                    </div>
                                </td>
                            </tr>
                            )):
                            <tr>
                            <td colSpan={stats.length+2}>
                                {noDataMessage}
                            </td>
                            </tr>
                        }
                    </tbody>
                </table>
            </div>
        </div>
    )
}

export default Table