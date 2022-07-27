import {createTransport} from "nodemailer"
import twilio from "twilio"
import { loggerError, loggerTrace } from "./logger.js";
import dotenv from "dotenv"
import { mailDisplay, whatsappDisplay } from "../services/helpers.js";

dotenv.config()

const transporter = createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    auth: {
        user: process.env.EMAIL_NODEMAILER,
        pass: process.env.PASSWORD_NODEMAILER
    },
    tls: {
        rejectUnauthorized: false
    }
});
async function registrationEmail (){ //enviar mail al registrarse
    const registerMailOptions = {
        from: "Server NodeJS",
        to: process.env.EMAIL_NODEMAILER,
        subject:"Nuevo Registro",
        html:`<h1>Nuevo Usuario Registrado</h1>`
    }
    try{
        await transporter.sendMail(registerMailOptions)
    }
    catch(err){
        loggerError.error(err)
    }
}

const accountId = process.env.ACCOUNT_ID_TWILIO
const authToken = process.env.AUTH_TOKEN_TWILIO
const messageClient = twilio(accountId,authToken)
async function cartMessage (number, prefix){ //enviar mensaje de proceso del pedido
    try{
        const message = await messageClient.messages.create({
            body:"Su pedido ha sido recibido y se encuentra en proceso.",
            from:process.env.BOT_PHONE,
            to:`${prefix}${number}`
        })
        loggerTrace.trace("sms enviado con exito")
    }
    catch (err){
        loggerError.error(err)
    }
}

async function newOrderMail (user, data){
    const registerMailOptions = {
        from: "Server NodeJS",
        to: process.env.EMAIL_NODEMAILER,
        subject:`Nuevo pedido de ${user.mail}`,
        html:mailDisplay(user,data)
    }
    try{
        await transporter.sendMail(registerMailOptions)
        loggerTrace.trace("email enviado con exito")
    }
    catch(err){
        loggerError.error(err)
    }
}
async function newOrderWhatsapp (user,data){
    try{
        const message = await messageClient.messages.create({
            body: whatsappDisplay(user,data),
            from: `whatsapp:${process.env.WHATSAPP_PHONE}`,
            to: `whatsapp:${process.env.ADMIN_PHONE}`
        })
        loggerTrace.trace("mensaje whatsapp enviado con exito")
    }
    catch (err){
        loggerError.error(err)
    }            

}

export {cartMessage,newOrderMail,registrationEmail, newOrderWhatsapp}