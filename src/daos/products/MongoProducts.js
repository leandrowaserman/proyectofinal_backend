import dbManager from "../../managers/mongo/MongoManager.js"

import productFile from "../../models/product.js"

class MongoProduct{
    productManager = new dbManager(productFile)
    add = async (product) =>{
        return await this.productManager.add(product)
    }
    update = async (id, newProd) =>{
        return await this.productManager.update(id, newProd)
    }
    getById = async (id)=>{
        return await this.productManager.getById(id)
    }
    getAll = async() =>{
        return await this.productManager.getAll()
    }
    deleteById = async(id) =>{
        return await this.productManager.deleteById(id)
    }
    deleteAll = async() =>{
        return await this.productManager.deleteAll()
    }
}

export default MongoProduct