import express from 'express'
import { createTransport, SentMessageInfo } from 'nodemailer'
import { emailCredentials } from '../configs/config'
import { emailMessageContent } from './emailMessageContent'

interface EmailBodyInterface {
    returnEmail: string
    sendConfirmationEmail: boolean
    emailMessage: string
    senderName: string
}

export const sendEmail = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const { returnEmail, sendConfirmationEmail } = req.body as EmailBodyInterface
    const transporter = createTransport({ ...emailCredentials })

    const message = {
        from: returnEmail,
        to: 'taydengoodeill@gmail.com',
        subject: 'Contact Request Form Submitted',
        html: emailMessageContent(req)
    }

    const returnSenderMessage = {
        from: 'tayden.contact@gmail.com',
        to: returnEmail,
        subject: 'Copy of Tayden Flitcroft\'s Contact Request Form',
        html: `<div><strong>Copy of Message:</strong></div> <br> <br> ${emailMessageContent(req)} <br> <br> <div>Thank you and speak to you soon!</div><div>Tayden Flitcroft</div></div>`
    }

    let response

    await transporter.sendMail(message)
        .then ((mailRes: SentMessageInfo) => response = mailRes)
        .catch(err => response = err)

    if (sendConfirmationEmail) {
        await transporter.sendMail(returnSenderMessage)
            .catch((err) => err)
    }

    return response
}