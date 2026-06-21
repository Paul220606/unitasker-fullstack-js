import {requestData} from "../../shared/utils/requestData"

const editProfile = async (data) => {
    return await requestData(data, 'auth', 'edit', 'post')
}

export {editProfile}
