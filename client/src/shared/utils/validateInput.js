const defaultRules = {
    required: {
        validator: value=> Boolean(value),
        messageRender: type=>type + ' is required.',    
    },
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

function confirmPasswordRule(password) {
    return {
        validator: val => val.trim() === (password ?? '').trim(),
        messageRender: msg => msg + ' must match the password above.'
    }
}

function validateInput(type, value, textMessage, rule = defaultRules[type]){
    return !rule.validator(value) && rule.messageRender(textMessage)
}

function validateAllInputs (inputs, data, setErrors, isRegistered) {
    const newErrors = {}
    inputs.forEach((input)=> {
        const id = input.purpose
        const value = data[id]
        let err = null
        if (isRegistered){
            if (id == 'confirmPassword'){
                err = validateInput(input.type, value, input.textMessage, confirmPasswordRule(data['password']))
            } else {
                err = validateInput(input.type, value, input.textMessage)
            }
        } else {
            err = validateInput('required', value, input.textMessage)
        }
        newErrors[id] = err
    })
    setErrors(newErrors)
    return newErrors
}

export {confirmPasswordRule, validateAllInputs, validateInput}