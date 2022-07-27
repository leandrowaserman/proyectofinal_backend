import express from "express"
import path from 'path';
import { adminAuth, loginAuth } from "../auth/authMiddleware.js";
import {productDao} from "../daos/index.js"
import dotenv from "dotenv"

dotenv.config()
const productsRouter = express.Router()

productsRouter.get('/',loginAuth,(req,res)=>{
    res.sendFile(path.join(process.cwd(), 'src/public/views/products.html'))

})
productsRouter.get("/change",adminAuth,(req,res)=>{
    res.sendFile(path.join(process.cwd(), 'src/public/views/productCreator.html'))
})
productsRouter.get("/category/:category",loginAuth,async(req,res)=>{
    let param = req.params.category
    let found = await productDao.getByCategory(param)
    res.send(found)
})
productsRouter.get("/:id",loginAuth,async(req,res)=>{
    let param = req.params.id
    let found = await productDao.getById(param)
    res.send(found)
})
productsRouter.put("/:id",async(req,res)=>{ // solo via postman
    if(!process.env.ROL_POSTMAN!="admin") return res.status(401).send("no tienes derechos para hacer eso")
    let param = req.params.id
    let info = req.body
    res.send(await productDao.update(param, info))
})
productsRouter.delete("/:id",async(req,res)=>{ // solo via postman
    if(!process.env.ROL_POSTMAN!="admin") return res.status(401).send("no tienes derechos para hacer eso")
    let param = req.params.id
    res.send(await productDao.deleteById(param))
})
export default productsRouter