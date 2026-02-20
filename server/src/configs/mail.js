import nodemailer from "nodemailer"

import { GMAILAPPPASSWORD, GMAILUSER } from "./env.js"

let transporter
async function initMail() {
    // Test Mail
    const testAccount = await nodemailer.createTestAccount()
    transporter = nodemailer.createTransport({
        host: "smtp.ethereal.email",
        port: 587,
        secure: false,
        auth: {
            user : testAccount.user,
            pass : testAccount.pass,
        },
    })
    console.log("Ethereal email account is already: ", testAccount.user)
    
    // Real Mail
    /*
    transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: GMAILUSER,
            pass: GMAILAPPPASSWORD
        }
    })
    */
}

export {initMail, transporter}