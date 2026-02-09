import { requestData } from "../../shared/utils/requestData.js"

const createTask = async (data) => {
    return await requestData(data, 'task', 'create', 'post')
}

export {createTask}