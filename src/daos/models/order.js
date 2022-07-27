import mongoose from "mongoose"
import { PhoneSchema } from "./user.js"


const orderCollection = 'orders'

const UserSchema = new mongoose.Schema({
    mail:{
        type:String,
        required:true
    },
    name:{
        type:String,
        required:true  
    },
    last_name:{
        type:String,
        required:true 
    },
    age:{
        type:Number,
        required:true  
    },
    username:{
        type:String,
        required:true,
    },
    phone:{
        type:PhoneSchema,
        required:true
    }
})

const OrderSchema = new mongoose.Schema(
    {
        user:{
            type:UserSchema,
            required:true  
        },
        products: {
            type:Array,
            required:true
        },
        state:{
            type:String,
            default:"generated"
        },
        order_id:{
            type:Number,
            required:true
        }
    },
    {
        timestamps:true
    }
)
const OrderModel = mongoose.model(orderCollection,OrderSchema)
export default OrderModel