import { randomInt } from 'crypto'

const createOTP = () => {
    const expiredDuration = 5
    const otp = randomInt(100000, 1000000).toString()
    const expiredAt = new Date(Date.now()+ expiredDuration*60*1000)
    return {otp, expiredAt, expiredDuration}
}

export {createOTP}