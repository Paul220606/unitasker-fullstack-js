const defaultRules = {
    text: {
        validator: val => val.trim().length >= 8,
        messageRender: type => type + ' must be longer then 8 characters.'
    },
    email: {
        validator: val => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val.trim()),
        messageRender: type => type + ' must be in an email format.'
    },
    password: {
        validator: val => /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/.test(val.trim()),
        messageRender: type => type + ' must be at least 8 characters long, including at least one uppercase letter, one lowercase letter, and one number.'
    }
}

function validateInput(type, value, textMessage, rule = defaultRules[type]){
    return !rule.validator(value) && rule.messageRender(textMessage)
}

export default validateInput