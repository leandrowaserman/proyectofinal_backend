import mongoose from "mongoose"

const chatCollection = 'messages'


const MessagesSchema = new mongoose.Schema(
    {
        email:{
            type:String,
            required:true
        },
        type:{
            type:String,
            required:true
        },
        message:{
            type:String,
            required:true
        }
    },
    {
        timestamps:true
    }
)
const ChatModel = mongoose.model(chatCollection,MessagesSchema)

export default ChatModel