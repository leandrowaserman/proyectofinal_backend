import express from "express"
import path from 'path';
const registerRouter = express.Router()

registerRouter.get('/',(req,res)=>{
    const user = req.session.passport?.user
    if (user) {
        res.send(`<a href="http://localhost:8080">volver al inicio</a> <p>${user.name}, no te puedes registar estando logueado.</p>`)
    } else {
        res.sendFile(path.join(process.cwd(), 'src/public/views/register.html'))
    }
})
registerRouter.get('/error', (req, res) =>{
    res.send(`<a href="http://localhost:8080/register">volver</a> <p>Error en el Registro</p>`)
})
export default registerRouter