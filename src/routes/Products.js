const express = require('express')
const router = express.Router()
const ProductManager = require('../managers/ProductManager')
const ProductService = new ProductManager()
let admin = require('../managers/AdminManager.js')

router.get('/', (req, res)=>{
    ProductService.getAll().then(result=>res.send(result))
})
router.get('/:id', (req,res)=>{
    let param = req.params.id
    if(isNaN(param))return(res.status(400).send({error:"No es un numero"}))
    let id = parseInt(param)
    ProductService.getById(id).then(result=>res.send(result))
})
router.post('/',(req,res)=>{
    if(admin){
        let product = req.body
        console.log(req.body)
        ProductService.add(product).then(result=>res.send(result))
    }
    else{
        res.send({status:"error", error:"no tienes permisos para hacer eso"})
    }
})
router.put('/:id',(req,res)=>{
    if(admin){
        let param = req.params.id
        if(isNaN(param))return(res.status(400).send({error:"No es un numero"}))
        let id = parseInt(param)
        let product = req.body
        ProductService.overwrite(product, id).then(result=>res.send(result))
    }
    else{
        res.send({status:"error", error:"no tienes permisos para hacer eso"})
    }
})
router.delete('/:id', (req, res)=>{
    if (admin){
        let param = req.params.id
        if(isNaN(param))return(res.status(400).send({error:"No es un numero"}))
        let id = parseInt(param)
        ProductService.deleteById(id).then(result=>res.send(result))
    }
    else{
        res.send({status:"error", error:"no tienes permisos para hacer eso"})
    }
})

module.exports= router 