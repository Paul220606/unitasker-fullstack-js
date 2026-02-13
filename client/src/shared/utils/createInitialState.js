function createInputObject(inputs, value='') {
    const initialState = {}
    inputs.forEach(input => {
        initialState[input.purpose] = input.value || value
    })
    return initialState
}

function createNullInputObject(inputs) {
    const initialState = {}
    inputs.forEach(input => {
        initialState[input.purpose] = ''
    })
    return initialState
}

export {createInputObject, createNullInputObject}