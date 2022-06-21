import nodemailer from "nodemailer"
import dotenv from 'dotenv'
dotenv.config()

class MailServiceClass {

    constructor() {
        const smtpConfig = {
            host: process.env.SMTP_HOST,
            port: process.env.SMTP_PORT,
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASSWORD
            }
        }
        this.transporter = nodemailer.createTransport(smtpConfig)
        this.transporter.verify((err, success) => {
            if (err) {
                throw err
            }
        });
    }

    async sendActivationMail(to, link) {
        try {
            await this.transporter.sendMail({
                from: process.env.SMTP_USER,
                to,
                subject: 'Активаиця аккаунта на ' + process.env.API_URL,
                text: '',
                html:
                    `
                    <div>
                        <h1>Для активации перейдтие по ссылке</h1>
                        <a href="${link}">${link}</a>
                    </div>
                `
            })
        } catch (e) {
            console.log(e)
        }
    }
}

export const MailService = new MailServiceClass()