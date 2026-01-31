import axios from 'axios'
const API_URL = import.meta.env.VITE_API_URL

const login = async (data) => {
}

const register = async (data) => {
    try {
        const res = await axios.post(`${API_URL}/auth/register`, data)
        return res.data
    } catch (err){
        console.log("Error while fetching register data", err)
        throw err
    } 
}

export {login, register}
