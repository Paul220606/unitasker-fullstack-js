import i18n from "../../i18n"

const defaultRules = {
    required: {
        validator: value=> Boolean(value),
        messageRender: type=>i18n.t('validation.required', {field: type}),    
    },
    text: {
        validator: val => val.trim().length >= 8,
        messageRender: type => i18n.t('validation.minLength', {field: type}),
    },
    tel: {
        validator: val => /^[+]?[(]?[0-9]{1,4}[)]?[-\s.]?[(]?[0-9]{1,4}[)]?[-\s.]?[0-9]{1,4}$/im.test(val.trim()),
        messageRender: type => i18n.t('validation.phone', {field: type}),
    },
    email: {
        validator: val => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val.trim()),
        messageRender: type => i18n.t('validation.email', {field: type}),
    },
    password: {
        validator: val => /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/.test(val.trim()),
        messageRender: type => i18n.t('validation.password', {field: type}),
    }
}

function confirmPasswordRule(password) {
    return {
        validator: val => val.trim() === (password ?? '').trim(),
        messageRender: msg => i18n.t('validation.confirmPassword', {field: msg}),
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
        if (input.required) 
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