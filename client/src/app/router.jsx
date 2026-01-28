import HomePage from "../features/home/pages/Home"

const publicRoutes = [
    {path: '/', component: HomePage,},
    {path: '/signin', component: 'div',},
    {path: '/signup', component: 'div',},
]

export {publicRoutes}