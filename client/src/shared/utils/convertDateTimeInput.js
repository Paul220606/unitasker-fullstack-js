const convertDateTimeInput = (str)=> {
    const [datePart, timePart] = str.split(', ')
    const [day, month, year] = datePart.split('/')
    const [hour, minute] = timePart.split(':')

    return `${year}-${month}-${day}T${hour}:${minute}`
}

export default convertDateTimeInput