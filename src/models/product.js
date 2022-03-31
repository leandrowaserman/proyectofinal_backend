const mongoose = require('mongoose');   

const productCollection = 'products'


const ProductSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true  
    },
    thumbnail:{
        type:String,
        required:true,
    },
    stock:{
        type:Number,
        required:true
    },
    price:{
        type:Number,
        required:true
    },
    description:{
        type:String,
        required:true
    },
    checkable_id:{
        type:Number,
        required:true
    }
})
const Product = mongoose.model(productCollection,ProductSchema)

module.exports = Product