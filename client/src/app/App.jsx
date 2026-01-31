import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { createContext, useState } from 'react'

import { publicRoutes } from './router'
import DefaultLayout from '../shared/layouts/DefaultLayout'
import Toast from '../shared/components/Toast'

const ToastContext = createContext()
export {ToastContext}

function App() {
    const [toasts, setToasts] = useState([])

    const showToast = (title, message, type= "danger") => {
        const id= Date.now()
        setToasts(prev=> [...prev, {id, title, message, type}])
    }

    return (
        <Router>
            <div className="toast-container position-fixed bottom-0 end-0 p-3 d-flex flex-column-reverse" style={{ zIndex: 9999 }}>
                {toasts.map(t => (
                    <Toast
                    key={t.id}
                    show={true}
                    title={t.title}
                    message={t.message}
                    type={t.type}
                    onClose={() => setToasts(prev => prev.filter(x => x.id !== t.id))}
                />
                ))}
                
            </div>

            <Routes>
                {publicRoutes.map((route, index)=>{
                   const Layout = route.layout || DefaultLayout
                   const Page = route.component
                   return <Route key={index} path={route.path} element={
                    <Layout>
                        <ToastContext.Provider value={{showToast}}>
                            <Page/>
                        </ToastContext.Provider>
                    </Layout>
                   }/>
                })}
            </Routes>
        </Router>
    )
}

export default App