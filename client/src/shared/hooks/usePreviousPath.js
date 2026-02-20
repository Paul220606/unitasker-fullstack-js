import { useEffect, useRef } from "react"
import { useLocation } from "react-router-dom"

export function usePreviousPath() {
    const location = useLocation()
    const prevPath = useRef(null)

    useEffect(()=>{
        prevPath.current = location.pathname
    }, [location])

    return prevPath.current
}