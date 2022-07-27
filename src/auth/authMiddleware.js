import { request, response } from "express"

const loginAuth = (req = request,res = response,next)=>{
    const user = req.session.passport?.user
    if(!user) res.redirect('/login')
    else next()
    res 
}

const adminAuth = (req = request,res = response,next)=>{
    const user = req.session.passport?.user
    if(!user) res.redirect('/login')
    else{
        const rol = req.session.passport.user.rol
        if(rol!="admin"){
            res.status(400).send({
                message:"you dont have access to this route"
            })
        }
        else next()
    }
}
const notLoggedAuth = (req = request, res = response, next)=>{
    const user = req.session.passport?.user
    if(user) res.redirect("/")
    else next()
}

export{
    loginAuth,
    adminAuth,
    notLoggedAuth
}