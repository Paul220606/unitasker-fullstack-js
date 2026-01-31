function checkDataNull(data) {
    Object.keys(data).forEach(key => {
        if (data[key] === null || data[key] === '') {
            delete data[key]
        }
    })
    return data
}

function checkDataArrayNull(dataArr){
    
}

export {checkDataNull, checkDataArrayNull}