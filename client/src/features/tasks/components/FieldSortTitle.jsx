import { Link } from "react-router-dom"


export default function FieldSortTitle ({sortKey, label, sortedStats, setSortedStats}) {
    const order = sortedStats.title === sortKey ? sortedStats.order : ''
    const orderIconClass = {
        asc :  'bi bi-sort-down-alt',
        desc:  'bi bi-sort-down',
        none: 'bi bi-filter'
    }
    const switchOrder = () => {
        let nextOrder 
        if (order === 'desc'){
            nextOrder = 'asc'
        } else {
            nextOrder = 'desc'
        }
        setSortedStats({title: sortKey, order: nextOrder})
    }
    return (
        <div>{label} <Link onClick={switchOrder}><i className={order? orderIconClass[order]: orderIconClass['none']}/></Link></div>
    )
}