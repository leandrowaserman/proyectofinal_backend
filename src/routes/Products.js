const express = require('express')
const router = express.Router()
let  daos= require('../daos/index.js')
const productDao = daos.productDao

router.get('/', (req, res)=>{
    productDao.getAll().then(result=>res.send(result))
})
router.get('/:id', (req,res)=>{
    let param = req.params.id
    if(isNaN(param))return(res.status(400).send({error:"No es un numero"}))
    let id = parseInt(param)
    productDao.getById(id).then(result=>res.send(result))
})
router.post('/',(req,res)=>{
    let product = req.body
    console.log(req.body)
    productDao.add(product).then(result=>res.send(result))
})
router.put('/:id',(req,res)=>{
    let param = req.params.id
    if(isNaN(param))return(res.status(400).send({error:"No es un numero"}))
    let id = parseInt(param)
    let product = req.body
    productDao.update(id, product).then(result=>res.send(result))

})
router.delete('/:id', (req, res)=>{
    let param = req.params.id
    if(isNaN(param))return(res.status(400).send({error:"No es un numero"}))
    let id = parseInt(param)
    productDao.deleteById(id).then(result=>res.send(result))
})

module.exports= router 