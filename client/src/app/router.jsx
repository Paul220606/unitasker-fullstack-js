import { lazy } from 'react'

const Home = lazy(() => import("../features/home/pages/Home"))
const Login = lazy(() => import("../features/auth/pages/Login"))
const Register = lazy(() => import("../features/auth/pages/Register"))
const NewTask = lazy(() => import("../features/tasks/pages/NewTask"))
const TaskList = lazy(() => import("../features/tasks/pages/TaskList"))
const TaskBin = lazy(() => import("../features/tasks/pages/TaskBin"))
const Profile = lazy(() => import("../features/manager/pages/Profile"))

const onlyPublicRoutes = [
    {path: '/login', component: Login,},
    {path: '/register', component: Register,},
]

const publicRoutes = [
    {path: '/', component: Home,},
]

const privateRoutes = [
    {path: '/tasks/new', component: NewTask},
    {path: '/tasks/bin', component: TaskBin},
    {path: '/tasks', component: TaskList},
    {path: '/profile', component: Profile},
]

export {publicRoutes, privateRoutes, onlyPublicRoutes}