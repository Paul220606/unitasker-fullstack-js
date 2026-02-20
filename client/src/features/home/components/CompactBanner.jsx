import { useEffect, useState } from "react"

import { convertDateTimeInput } from "../../../shared/utils/convertDateTimeInput"

export default function CompactBanner ({tasks}) {
    const [timeLeft, setTimeLeft] = useState({days: 0, hours: 0, minutes: 0, seconds: 0})
    const [shownDueDateIndex, setShownDueDateIndex] = useState(0)
    const [isVisible, setIsVisible] = useState(true)
    const [type, setType] = useState('warning')
    const task = tasks[shownDueDateIndex]
    const handleSwitchTask = (next) => {
        setShownDueDateIndex(next?(prev=>prev+1):(prev=> prev-1))
    }
    useEffect(()=> {
        if (!task || !task.dueDate) return
        const calTimeLeft = ()=> {
            const miliSecToSec = 1000
            const secToMinute = 60
            const secToHour = 60*60
            const secToDay = 60*60*24
            const now = new Date()
            const dueDate = convertDateTimeInput(task.dueDate, 'object')
            const dif = dueDate - now
            let days
            if (dif < 0) {
                days = -1
                setTimeLeft({days: 0, hours: 0, minutes: 0, seconds: 0})
            } else {
                const difSec = Math.floor(dif/miliSecToSec)
                days = Math.floor(difSec/secToDay)
                const hours = Math.floor((difSec - days*secToDay)/secToHour)
                const minutes = Math.floor((difSec - days*secToDay - hours*secToHour)/secToMinute)
                const seconds = difSec - days*secToDay - hours*secToHour - minutes*secToMinute
                setTimeLeft({days, hours, minutes, seconds})
            }
            setType(days>=2?'success':days<=0?'danger':'warning')
        }
        calTimeLeft()
        const timer = setInterval(calTimeLeft, 1000)
        return ()=> clearInterval(timer)
    }, [task])
    if (!task) return

    return ( isVisible?
    <div className={`position-fixed top-0 end-0 mt-5 me-3 bg-dark bg-opacity-75 text-light rounded-3 p-3 border border-${type} border-2`}
     style={{
         zIndex: 999, 
         minWidth: '320px',
         boxShadow: '0 4px 12px rgba(0,0,0,0.3)'
     }}>
        <button
            className={`btn btn-sm text-${type} position-absolute top-0 end-0 m-2 p-1`}
            onClick={() => setIsVisible(false)}
            title="Close"
            >
            <i className="bi bi-chevron-double-right fs-5"></i>
        </button>
        <div className="d-flex align-items-center gap-2 mb-2">
            <i className={`bi bi-clock-history text-${type}`}></i>
            <small className="text-light opacity-75 fw-semibold">Next Deadline</small>
        </div>
        <div className="fw-bold text-light mb-1">{task.title}</div>
        <div className="d-flex justify-content-between align-items-center">
            <small className="text-light opacity-50">{task.dueDate}</small>
            <div className={`fw-bold text-${type}`}>
                {timeLeft.days}d {timeLeft.hours}h {timeLeft.minutes}m {timeLeft.seconds}s
            </div>
        </div>
        {handleSwitchTask && (
            <div className="d-flex gap-2 mt-3 justify-content-end">
                <button 
                    className={`btn btn-sm btn-outline-${type}`}
                    onClick={() => handleSwitchTask(false)}
                    title="Previous task"
                    {...(!tasks[shownDueDateIndex-1] || !tasks[shownDueDateIndex-1].dueDate)?{disabled: true}: {}}>
                    <i className="bi bi-chevron-left"></i>
                </button>
                <button 
                    className={`btn btn-sm btn-outline-${type}`}
                    onClick={() => handleSwitchTask(true)}
                    title="Next task"
                    {...(!tasks[shownDueDateIndex+1] || !tasks[shownDueDateIndex+1].dueDate)?{disabled: true}: {}}>
                    <i className="bi bi-chevron-right"></i>
                </button>
            </div>
        )}
    </div>
    : <div className={`position-fixed top-0 end-0 mt-5 bg-dark bg-opacity-75 text-light rounded-3 p-2 border border-white border-2`}
         style={{
             zIndex: 999, 
             boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
             cursor: 'pointer'
         }}
         onClick={() => setIsVisible(true)}
         title="Show deadline">
        <i className={`bi bi-chevron-double-left fs-5`}></i>
    </div>)}