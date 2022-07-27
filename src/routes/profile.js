import express from "express"
import { loginAuth } from "../auth/authMiddleware.js"

const profileRouter = express.Router()

profileRouter.get("/",loginAuth,(req,res)=>{
    let user = req.session.passport.user
    res.send(`<a href="${req.protocol}://${req.headers.host}/">volver al inicio</a><h1>Tu perfil</h1><br><img src=${user.avatar}><br><p>nombre completo: ${user.name} ${user.last_name} </p><br><p>mail: ${user.mail}</p><br><p>username: ${user.username}</p><br><p>edad: ${user.age}</p>`)
})

export default profileRouter