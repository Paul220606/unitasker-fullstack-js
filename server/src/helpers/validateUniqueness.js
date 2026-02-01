async function validateUniqueness(field, value, Model) {
    const existed = await Model.findOne({ [field]: value })
    return !!existed
}


export {validateUniqueness}