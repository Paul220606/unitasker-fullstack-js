function createInitialStateObject(inputs) {
    const initialState = {}
    inputs.forEach(input => {
        initialState[input.purpose] = ''
    })
    return initialState
}

export {createInitialStateObject}