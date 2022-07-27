import mongoose from "mongoose";  

const userCollection = 'users'


const CartSchema = new mongoose.Schema(
    {
        products:[
            {
                prod_id:{
                    type:String,
                    required:true
                },
                quantity:{
                    type:Number,
                    required:true
                }
            }
        ]
    },
    {
        timestamps:true
    }
)
const PhoneSchema = new mongoose.Schema(
    {
        prefix:{
            type:String,
            required:true
        },
        number:{
            type:Number,
            required:true
        }
    }
)
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
    avatar:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    rol:{
        type:String,
        required:true
    },
    phone:{
        type:PhoneSchema,
        required:true
    },
    cart:{
        type:CartSchema,
        required:true
    }
})


const UserModel = mongoose.model(userCollection,UserSchema)

export {UserModel,PhoneSchema}