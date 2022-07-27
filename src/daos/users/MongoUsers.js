import dbManager from "../../managers/mongo/MongoManager.js"
import {UserModel} from "../models/user.js"

class MongoUsers {
    UserManager = new dbManager(UserModel)
    add = async(user) =>{
        return await this.UserManager.add(user)
    }
    getByMail = async(mail) =>{
        return await this.UserManager.getByMail(mail)
    }
    addProduct = async(user,id_prod)=>{
        return await this.UserManager.addProduct(user,id_prod)
    }
    addProductById = async (id,id_prod)=>{
        return await this.UserManager.addProductById(id,id_prod)
    }
    getCart = async(id)=>{
        return await this.UserManager.getCart(id)
    }
    emptyCart = async(id)=>{
        return await this.UserManager.emptyCart(id)
    }
}
export default MongoUsers