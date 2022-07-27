import express from "express"

import { orderDao, productDao, userDao } from "../daos/index.js";
import { loginAuth } from "../auth/authMiddleware.js";
import {cartMessage,newOrderMail,newOrderWhatsapp} from "../utils/messaging.js"
import { cartDisplay, mailDisplay } from "../services/helpers.js";

const cartRouter = express.Router()

cartRouter.get("/",loginAuth,async (req,res)=>{
    let id = req.session.passport.user._id
    let cart = await userDao.getCart(id)
    let productsId = cart.products
    if(productsId.length==0)res.send(`<a href="${req.protocol}://${req.headers.host}/">volver al inicio</a><h1>Carrito</h1><p>No hay productos</p>`)
    else{
        let cartProducts = []
        await Promise.all (productsId.map   (async (products)=>{
            let id = products.prod_id
            let quantity = products.quantity
            let foundProduct = await productDao.getById(id)
            let newProduct = {quantity:quantity,name:foundProduct[0].name,price:foundProduct[0].price,image:foundProduct[0].thumbnail}
            cartProducts.push(newProduct)
        }))
        let display = cartDisplay(cartProducts)
        res.send(display)
        
    }
})
cartRouter.post("/checkout",loginAuth,async(req,res)=>{
    let user = req.session.passport.user
    let cart = await userDao.getCart(user._id)
    let productsId = cart.products
    if(productsId.length==0)res.send(`<a href="${req.protocol}://${req.headers.host}/">volver al inicio</a><h1>Carrito</h1><p>No hay productos</p>`)
    let cartProducts = []
    await Promise.all (productsId.map   (async (products)=>{
        let id = products.prod_id
        let quantity = products.quantity
        let foundProduct = await productDao.getById(id)
        let newProduct = Object.assign({quantity:quantity},foundProduct)
        cartProducts.push(newProduct)
    }))
    let stringProducts = JSON.stringify(cartProducts)
    console.log(stringProducts)
    await orderDao.createOrder(user,cartProducts)
    await newOrderMail(user, cartProducts)
    await newOrderWhatsapp(user, cartProducts)
    let phone = user.phone
    await cartMessage(phone.number, phone.prefix)
    await userDao.emptyCart(user._id)
    res.redirect("/")
})
cartRouter.post("/delete",loginAuth,async(req,res)=>{ // tuve que usar el post en vez del delete porque no te deja hacer un submit con method DELETE
    let user = req.session.passport.user
    let cart = await userDao.getCart(user._id)
    let productsId = cart.products
    if(productsId.length==0)res.send(`<a href="/">volver al inicio</a><h1>Carrito</h1><p>No hay productos</p>`)
    await userDao.emptyCart(user._id)
    res.send(`<a href="/">volver al inicio</a><h1>Carrito</h1><p>No hay productos</p>`)

})
cartRouter.put("/:idUser/:idProd",async(req,res)=>{ // solo via Postman
    if(!process.env.ROL_POSTMAN!="admin") return res.status(401).send("no tienes derechos para hacer eso")
    let idUser = req.params.idUser
    let idProd = req.params.idProd
    await userDao.addProductById(idUser,idProd)
    res.send("cart updated")
})
cartRouter.delete("/:idUser",async(req,res)=>{ // solo via Postman
    if(!process.env.ROL_POSTMAN!="admin") return res.status(401).send("no tienes derechos para hacer eso")
    let idUser = req.params.idUser
    await userDao.emptyCart(idUser)
    res.send("cart deleted")
})

export default cartRouter