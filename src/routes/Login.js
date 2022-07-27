import express from "express"
import path from 'path';
const loginRouter = express.Router()

loginRouter.get('/', (req, res) => {
    const user = req.session.passport?.user
    if (user) {
        let name = user.username
        res.send(`<a href="${req.protocol}://${req.headers.host}/">inicio</a> <a href="${req.protocol}://${req.headers.host}/logout">logout</a><p>bienvenido, ${name}</p>`)
    } else {
        res.sendFile(path.join(process.cwd(), 'src/public/views/login.html'))
    }
})
loginRouter.get('/error', (req, res) =>{
    res.send(`<a href="${req.protocol}://${req.headers.host}/login">volver</a> <p>Error Login</p>`)
})

export default loginRouter