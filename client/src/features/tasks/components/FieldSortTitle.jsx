import { useEffect, useState } from "react"
import { Link } from "react-router-dom"


export default function FieldSortTitle ({sortKey, label, firstOrder, sortedStats, setSortedStats}) {
    const [order, setOrder] = useState(firstOrder)
    useEffect(()=>{
        if (sortedStats.title !== sortKey) {
            setOrder('')
        }
    }, [sortedStats])
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
        setOrder(nextOrder)
    }
    return (
        <div>{label} <Link onClick={switchOrder}><i className={order? orderIconClass[order]: orderIconClass['none']}/></Link></div>
    )
}