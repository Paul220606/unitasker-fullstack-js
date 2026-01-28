import axios from 'axios'
const API_URL = import.meta.env.VITE_API_URL
const fetchData = async () => {
    try {
        const res = await axios.get(API_URL)
        console.log(res.data)
    } catch (err) {
        console.log("Error while fetching data", err)
    }
}

export default fetchData
