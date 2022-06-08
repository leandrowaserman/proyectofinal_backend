import express from "express"
import path from 'path';
const productRouter = express.Router()

productRouter.get("/",(req,res)=>{
    let user = req.session.passport?.user
    if(!user) res.redirect("/login")
    if(user.rol != "admin") res.redirect("/")
    res.sendFile(path.join(process.cwd(), 'src/public/views/productCreator.html'))
})
productRouter.get("/error",(req,res)=>{
    res.send(`<a href="http://localhost:8080/products">volver</a> <p>Error al crear producto</p>`)
})


export default productRouter 