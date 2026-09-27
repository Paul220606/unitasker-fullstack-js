import { Suspense } from "react"

import Header from "../components/Header"
import Footer from "../components/Footer"
import PageLoader from "../components/PageLoader"

function DefaultLayout({children}) {
    return (
        <div>
            <Header/>
                <Suspense fallback={<PageLoader/>}>
                    <main className="flex-grow-1">{children}</main>
                    <Footer/>
                </Suspense>
        </div>
    )
}

export default DefaultLayout