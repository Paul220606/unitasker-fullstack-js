import { useTranslation } from "react-i18next"

import translateItem from "../utils/translateItem"

function Table({title, stats=[], fieldKeys=[], tasks=[], buttonsData=[], noDataMessage, modalFunc}) {
    const {t} = useTranslation()
    return (
        <div className="card bg-dark text-light shadow-sm mb-3">
            <div className="card-header">
                <h5>{title}</h5>
            </div>
            <div className="card-body">
                <table className="table table-dark table-hover">
                    <thead>
                        <tr>
                            {stats.map((title, index)=><th key={index}>{title}</th>)}
                            <th>{t('table.actions')}</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                        tasks.length > 0 ?
                        tasks.map((task)=>(
                            <tr key={task.displayedStats[0]}>
                                {task.displayedStats.map((taskStat, index)=>(
                                    <td key={index}>
                                        {fieldKeys[index]==='status'?
                                        <span className={`badge ${taskStat === "Completed" ? "bg-success" : taskStat === "Pending" ? "bg-warning" : taskStat === "Canceled"? "bg-danger" : "bg-primary"}`}>
                                            {translateItem(taskStat, "status", t)}
                                        </span>: 
                                        fieldKeys[index] === 'priority'?
                                        <span className={`badge ${taskStat === "High" ? "bg-danger" : taskStat === "Medium" ? "bg-warning":"bg-success"}`}>
                                            {translateItem(taskStat, "priority", t)}
                                        </span>:
                                        <div>{typeof taskStat === 'string' && taskStat.length > 25? (taskStat.substring(0, 23) + '...'): taskStat}</div>}
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