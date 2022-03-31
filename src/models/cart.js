const mongoose = require('mongoose');  

const cartCollection = 'carts'

const CartSchema = new mongoose.Schema(
    {
        products:{
            type:Array
        },
        checkable_id:{
            type:Number,
            required:true
        }
    },
    {
        timestamps:true
    }
)

const Cart = mongoose.model(cartCollection,CartSchema)

module.exports = Cart