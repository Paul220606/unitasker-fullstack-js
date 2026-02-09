import {requestData} from "../../shared/utils/requestData"

const login = async (data) => {
    return await requestData(data, 'auth', 'login', 'post')
}

const register = async (data) => {
    return await requestData(data, 'auth', 'register', 'post')
}

export {login, register}
