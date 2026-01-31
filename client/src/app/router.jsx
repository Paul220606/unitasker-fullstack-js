import Home from "../features/home/pages/Home"
import Login from "../features/auth/pages/Login"
import Register from "../features/auth/pages/Register"

const publicRoutes = [
    {path: '/', component: Home,},
    {path: '/login', component: Login,},
    {path: '/register', component: Register,},
]

export {publicRoutes}