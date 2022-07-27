import express from "express"
import { productDao, userDao } from "../daos/index.js"

const apiRouter = express.Router()

apiRouter.get("/user",async(req,res)=>{
    const altUser = req.session.passport?.user
    if(altUser){
        let user = await userDao.getByMail(altUser.mail)
        res.send(user[0])
    }
    else res.send({connection:"no"})
})
apiRouter.get("/products",async(req,res)=>{
    const products = await productDao.getAll()
    res.send(products)
})

export default apiRouter