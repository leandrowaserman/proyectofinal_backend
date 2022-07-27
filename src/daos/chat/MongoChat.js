import dbManager from "../../managers/mongo/MongoManager.js"
import ChatModel from "../models/chat.js"

class MongoChat {
    ChatManager = new dbManager(ChatModel)
    sendMessage = async(message, user)=>{
        return await this.ChatManager.sendMessage(message,user)
    }
    getMessagesUser = async(user)=>{
        return await this.ChatManager.getMessagesUser(user)
    }
    getMessagesAdmin = async() =>{
        return await this.ChatManager.getMessagesAdmin()
    }
    getAll = async()=>{
        return await this.ChatManager.getAll()
    }
}

export default MongoChat