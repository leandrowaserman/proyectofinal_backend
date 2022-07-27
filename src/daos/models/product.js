import mongoose from "mongoose"

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
    category:{
        type:String,
        required:true
    }
})
const ProductModel = mongoose.model(productCollection,ProductSchema)

export {ProductModel, ProductSchema}