function createInputObject(inputs, value='') {
    const initialState = {}
    inputs.forEach(input => {
        initialState[input.purpose] = value
    })
    return initialState
}

export {createInputObject}