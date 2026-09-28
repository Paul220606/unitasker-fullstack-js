import { useEffect } from "react"

import { requestData } from "../utils/requestData.js"

const useFetchingData = (user, feature, action, setLoading, setFunctions, checkedData={}) => {
    const fetchingData = async ()=> {
        if (user) {
            try {
                setLoading(true)
                const data = await requestData(checkedData, feature, action, 'get')
                setFunctions.forEach((func, index)=> {
                    func(Object.values(data)[index])
                })
            } catch (err){
                console.error('Error fetching: ', err)
            } finally {
                setLoading(false)
            }
        } else {
            setLoading(false)
        }
    }
    
    const checkedKey = JSON.stringify(checkedData)
    useEffect(()=> {
        fetchingData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user, checkedKey])
    return fetchingData
}

export default useFetchingData