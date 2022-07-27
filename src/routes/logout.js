import express from "express"
import { loginAuth } from "../auth/authMiddleware.js"
const logoutRouter = express.Router()

logoutRouter.get('/',loginAuth,(req,res)=>{
    let user = req.session.passport.user
    let name = user.username
    req.session.destroy(err => {
        if (err) { 
            res.redirect('/')
            
        } else {
           res.send(`<a href="${req.protocol}://${req.headers.host}/">login</a><p>${name}, te has desconectado.</p>`) 
        }
    })
})

export default logoutRouter