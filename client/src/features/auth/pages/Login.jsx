import AuthForm from "../components/AuthForm"
import { login } from "../auth.api"

function Login() {
    const inputs = [
        {
            purpose: 'emailOrUsername',
            textMessage: 'Email or Username',
            type: 'text'
        }, 
        {
            purpose: 'password',
            textMessage: 'Password',
            type: 'password'
        }
    ]
    return (
        <div className="d-flex justify-content-center align-items-center vh-100">
            <div className="card border-0 shadow-lg p-4" style={{ width: "400px" }}>
                <AuthForm title="Log in" inputs={inputs} submitText="Log in" apiFunction={fetchData}/>
            </div>
           
        </div>
    )
}

export default Login