import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { createContext, useState } from 'react'
import { ToastContainer } from 'react-toastify'


import { publicRoutes, privateRoutes, onlyPublicRoutes } from './router'
import DefaultLayout from '../shared/layouts/DefaultLayout'

const AppContext = createContext()
export {AppContext}

function App() {
    const [loading, setLoading] = useState(true)
    const [user, setUser] = useState(() => (localStorage.getItem('user')|| ''))
    let routes = [...publicRoutes, ...(user?privateRoutes:onlyPublicRoutes)]
    return (
        <AppContext.Provider value={{user, setUser, loading, setLoading}}>
            <Router>
                <Routes>
                    {routes.map((route, index)=>{
                    const Layout = route.layout || DefaultLayout
                    const Page = route.component
                    return <Route key={index} path={route.path} element={
                        <Layout>
                            <Page/>
                        </Layout>
                    }/>
                    })}
                </Routes>
            </Router>
            <ToastContainer
            position="bottom-right"
            autoClose={3000}
            theme="colored"/>
        </AppContext.Provider>
    )
}

export default App