async function validateUniqueness(type, value, Model) {
    const existed = await Model.findOne({ [type]: value })
    return !!existed
}


export {validateUniqueness}