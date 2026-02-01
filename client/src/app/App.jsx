import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { createContext, useState } from 'react'
import { ToastContainer } from 'react-bootstrap'
import {v4} from "uuid"

import { publicRoutes } from './router'
import DefaultLayout from '../shared/layouts/DefaultLayout'
import Toast from '../shared/components/Toast'

const AppContext = createContext()
export {AppContext}

function App() {
    const [toasts, setToasts] = useState([])
    const [user, setUser] = useState('')
    const showToast = (title, message, type= "danger") => {
        const id= v4()
        setToasts(prev=> [...prev, {id, title, message, type}])
    }
    const removeToast = (id) => {
        setToasts(prev=>prev.filter(toast => toast.id !== id))
    }

    return (
        <AppContext.Provider value={{showToast, user, setUser}}>
            <ToastContainer position="bottom-end" className="p-3">
                {toasts.map((toast)=>(
                    <Toast 
                    key={toast.id}
                    show={true}
                    title={toast.title}
                    message={toast.message}
                    type={toast.type}
                    onClose={()=> removeToast(toast.id)}/>
                ))}
            </ToastContainer>
            <Router>
                <Routes>
                    {publicRoutes.map((route, index)=>{
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
        </AppContext.Provider>
    )
}

export default App