import axiosClient from "../../api/axiosClient.js"

const requestData = async (data, feature, action, method='get') => {
    try {
        const res = await axiosClient({
            method,
            url: `/${feature}/${action}`,
            ...(method === 'get' ? { params: data } : { data })
        })
        return res.data
    } catch (err) {
        console.log(`Error while posting ${action} data`, err)
        throw err
    }
}

export {requestData}