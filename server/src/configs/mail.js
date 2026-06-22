import nodemailer from "nodemailer"

import { GMAILAPPPASSWORD, GMAILUSER } from "./env.js"

let transporter
async function initMail() {
    transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: GMAILUSER,
            pass: GMAILAPPPASSWORD
        }
    })
}

export {initMail, transporter}