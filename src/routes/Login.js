import express from "express"
import path from 'path';
const loginRouter = express.Router()

loginRouter.get('/', (req, res) => {
    const user = req.session.passport?.user
    if (user) {
        let name = user.username
        res.send(`<a href="http://localhost:8080/">inicio</a> <a href="http://localhost:8080/logout">logout</a><p>bienvenido, ${name}</p>`)
    } else {
        res.sendFile(path.join(process.cwd(), 'src/public/views/login.html'))
    }
})
loginRouter.get('/error', (req, res) =>{
    res.send(`<a href="http://localhost:8080/login">volver</a> <p>Error Login</p>`)
})

export default loginRouter