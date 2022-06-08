import {createTransport} from "nodemailer"
import twilio from "twilio"
import { loggerError, loggerTrace } from "./logger.js";

const ADMIN_DATA = {email:"crystal.breitenberg63@ethereal.email",password:'fcVdF94jSERS4HUByT',phone:"+541136412287"}
const transporter = createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    auth: {
        user: ADMIN_DATA.email,
        pass: ADMIN_DATA.password
    },
    tls: {
        rejectUnauthorized: false
    }
});
async function registrationEmail (data){ //enviar mail al registrarse
    const registerMailOptions = {
        from: "Server NodeJS",
        to: ADMIN_DATA.email,
        subject:"Nuevo Registro",
        html:`<h1>Nuevo Usuario Registrado</h1><br><p>${data}</p>`
    }
    try{
        await transporter.sendMail(registerMailOptions)
    }
    catch(err){
        loggerError.error(err)
    }
}

const accountId = "ACa419f332205f9ea05b8418479d6e2193"
const authToken = "718927ce3a11543e7ee09d1c99688ed1"
const messageClient = twilio(accountId,authToken)
async function cartMessage (number, prefix){ //enviar mensaje de proceso del pedido
    try{
        const message = await messageClient.messages.create({
            body:"Su pedido ha sido recibido y se encuentra en proceso.",
            from:"+19472253008",
            to:`${prefix}${number}`
        })
        loggerTrace.trace("sms enviado con exito")
    }
    catch (err){
        loggerError.error(err)
    }
}

async function newOrderMail (name, mail, data){
    const registerMailOptions = {
        from: "Server NodeJS",
        to: ADMIN_DATA.email,
        subject:`Nuevo pedido de ${mail}`,
        html:`<h1>Pedido de ${name}</h1><br>
        <pre>
        <code>${data}</code>
        </pre>`
    }
    try{
        await transporter.sendMail(registerMailOptions)
        loggerTrace.trace("email enviado con exito")
    }
    catch(err){
        loggerError.error(err)
    }
}
async function newOrderWhatsapp (name,mail,data){

    try{
        const message = await messageClient.messages.create({
            body: `Pedido de ${name} / mail: ${mail}
                ${data}`,
            from: 'whatsapp:+14155238886',
            to: "whatsapp:+5491136412287"
        })
        loggerTrace.trace("mensaje whatsapp enviado con exito")
    }
    catch (err){
        loggerError.error(err)
    }
}

export {cartMessage,newOrderMail,registrationEmail, newOrderWhatsapp}