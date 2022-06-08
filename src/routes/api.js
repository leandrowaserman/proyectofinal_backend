import express from "express"
import { productDao } from "../daos/index.js"

const apiRouter = express.Router()

apiRouter.get("/user",(req,res)=>{
    const altUser = req.session.passport?.user
    if(altUser)res.send(altUser)
    else res.send({connection:"no"})
})
apiRouter.get("/products",async(req,res)=>{
    const products = await productDao.getAll()
    res.send(products)
})

export default apiRouter