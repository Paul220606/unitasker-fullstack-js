import axios from "axios"

// Auth endpoints used before logging in: a 401 here means wrong credentials, not an expired session
const PUBLIC_AUTH_URLS = ["/auth/login", "/auth/register", "/auth/sendPin", "/auth/checkPin", "/auth/guest"]

const axiosClient = axios.create({
    baseURL: import.meta.env.VITE_API_URL
})

axiosClient.interceptors.request.use((config)=> {
    const token = localStorage.getItem("token")
    if (token) {
        config.headers.Authorization = `Bearer ${token}`
    }
    return config
})

axiosClient.interceptors.response.use(
    (res) => res,
    (err) => {
        const res = err.response
        const isPublicAuthRequest = PUBLIC_AUTH_URLS.includes(err.config?.url)

        // 401 on a protected route = missing/expired token -> log out
        if (res?.status === 401 && !isPublicAuthRequest) {
            localStorage.removeItem("token")
            localStorage.removeItem("user")
            window.location.href = "/login"
        }
        // Expected failures (wrong password/OTP, not found, expired, rate limited...)
        // come with {success: false, message}: hand them back so the UI can show the message
        if (res && res.status < 500 && res.data?.success === false) {
            return Promise.resolve(res)
        }
        return Promise.reject(err)
    }
)

export default axiosClient