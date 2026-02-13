import { requestData } from "../../shared/utils/requestData.js"

const createTask = async (data) => {
    return await requestData(data, 'task', 'create', 'post')
}

const editTask = async (data) => {
    return await requestData(data, 'task', 'edit', 'patch')
}

const restoreTask = async (data) => {
    return await requestData(data, 'task', 'restore', 'patch')
}

const deleteTask = async (data) => {
    return await requestData(data, 'task', 'softDelete', 'delete')
}

const deleteTaskPermanent = async (data) => {
    return await requestData(data, 'task', 'delete', 'delete')
}


export {createTask, editTask, deleteTask, deleteTaskPermanent, restoreTask}