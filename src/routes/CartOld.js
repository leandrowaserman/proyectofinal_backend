import express from "express"
const cartRouter = express.Router()

import {productDao, cartDao} from '../daos/index.js'


cartRouter.post('/', (req, res)=>{
    cartDao.create().then(result=>res.send(result))
})
cartRouter.delete('/:id', (req, res)=>{
    let param = req.params.id
    if(isNaN(param))return(res.status(400).send({error:"No es un numero"}))
    let id = parseInt(param)
    cartDao.deleteById(id).then(result=>res.send(result))
})
cartRouter.post('/:id/products', async (req,res)=>{
    let param = req.params.id
    let productsId = req.body
    let realProducts = []
    let nonUsableProducts = []
    if(isNaN(param))return(res.status(400).send({error:"No es un numero"}))
    let id = parseInt(param)
    await Promise.all (productsId.map(async (products)=>{
        let verifier = await productDao.getById(products)
        if(verifier.error || !verifier.length){
            nonUsableProducts.push(products)
        }else{
            realProducts.push(products)
        }
    })).then(cartDao.addProduct(id, realProducts).then(result=>res.send(result)))
    
})
cartRouter.get('/:id/products',async(req,res)=>{
    let param = req.params.id
    if(isNaN(param))return(res.status(400).send({error:"No es un numero"}))
    let id = parseInt(param)
    let cart = await cartDao.getById(id)
    if(Array.isArray(cart)){
        let productsId = cart[0].products
        let cartProducts = []
        await Promise.all (productsId.map   (async (products)=>{
            let newProduct = await productDao.getById(products)
            cartProducts.push(newProduct)
        }))
        res.send(cartProducts)
    }else{
        let productsId = cart.products
        let cartProducts = []
        await Promise.all (productsId.map   (async (products)=>{
            let newProduct = await productDao.getById(products)
            cartProducts.push(newProduct)
        }))
        res.send(cartProducts)
    }
})
cartRouter.delete('/:id/products/:id_prod', (req,res)=>{
    let cartIdParam = req.params.id
    let prodIdParam = req.params.id_prod
    if(isNaN(cartIdParam || prodIdParam))return(res.status(400).send({error:"No es un numero"}))
    let cartId= parseInt(cartIdParam)
    let prodId = parseInt(prodIdParam)
    cartDao.deleteProduct(cartId, prodId).then(result=>res.send(result))
})
export default cartRouter