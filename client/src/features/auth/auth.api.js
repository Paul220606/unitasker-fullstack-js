import {requestData} from "../../shared/utils/requestData"

const sendPin = async (data) => {
    return await requestData(data, 'auth', 'sendPin', 'post')
}

const checkPin = async (data) => {
    return await requestData(data, 'auth', 'checkPin', 'post')
}

const login = async (data) => {
    return await requestData(data, 'auth', 'login', 'post')
}

const guestLogin = async () => {
    return await requestData({}, 'auth', 'guest', 'post')
}

const register = async (data) => {
    return await requestData(data, 'auth', 'register', 'post')
}

export {login, register, sendPin, checkPin, guestLogin}
