import axios from 'axios'
const API_URL = import.meta.env.VITE_API_URL

const fetchingAuthData = async (data, action) => {
    try {
        const res = await axios.post(`${API_URL}/auth/${action}`, data)
        return res.data
    } catch (err) {{
        console.log(`Error while fetching ${action} data`, err)
        throw err
    }}
}

const login = async (data) => {
    return await fetchingAuthData(data, 'login')
}

const register = async (data) => {
    return await fetchingAuthData(data, 'register')
}

export {login, register}
