import Home from "../features/home/pages/Home"
import Login from "../features/auth/pages/Login"
import Register from "../features/auth/pages/Register"
import NewTask from "../features/tasks/pages/NewTask"
import TaskList from "../features/tasks/pages/TaskList"

const onlyPublicRoutes = [
    {path: '/login', component: Login,},
    {path: '/register', component: Register,},
]

const publicRoutes = [
    {path: '/', component: Home,},
]

const privateRoutes = [
    {path: '/tasks/new', component: NewTask},
    {path: '/tasks', component: TaskList},
    {path: '/profile', component: NewTask},
]

export {publicRoutes, privateRoutes, onlyPublicRoutes}