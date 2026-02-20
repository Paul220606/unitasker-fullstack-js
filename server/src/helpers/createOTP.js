const createOTP = () => {
    const expiredDuration = 5
    const otp = Math.floor(100000 + Math.random() * 900000).toString()
    const expiredAt = new Date(Date.now()+ expiredDuration*60*1000)
    return {otp, expiredAt, expiredDuration}
}

export {createOTP}