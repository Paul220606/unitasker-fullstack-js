const convertDateTimeInput = (str, type = 'string')=> {
    const [datePart, timePart] = str.split(', ')
    const [day, month, year] = datePart.split('/')
    const [hours, minutes, seconds] = timePart.split(':')    
    return type==='string'?`${year}-${month}-${day}T${hours}:${minutes}`: new Date(year, month - 1, day, hours, minutes, seconds)
}

export {convertDateTimeInput}