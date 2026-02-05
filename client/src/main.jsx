import React from "react"
import ReactDOM from "react-dom/client"

import 'react-toastify/dist/ReactToastify.css'
import "bootstrap/dist/css/bootstrap.min.css"
import "bootstrap-icons/font/bootstrap-icons.css"
import 'bootstrap/dist/js/bootstrap.bundle.min.js'

import "./styles/global.scss"
import App from "./app/App"

ReactDOM.createRoot(document.getElementById("root")).render(
    <React.StrictMode>
        <App/>
    </React.StrictMode>
)

