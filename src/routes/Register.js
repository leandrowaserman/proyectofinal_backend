import express from "express"
import path from 'path';
import { notLoggedAuth } from "../auth/authMiddleware.js";
const registerRouter = express.Router()

registerRouter.get('/',notLoggedAuth,(req,res)=>{
    res.sendFile(path.join(process.cwd(), 'src/public/views/register.html'))
})
registerRouter.get('/error', (req, res) =>{
    res.send(`<a href="${req.protocol}://${req.headers.host}/register">volver</a> <p>Error en el Registro</p>`)
})
export default registerRouter