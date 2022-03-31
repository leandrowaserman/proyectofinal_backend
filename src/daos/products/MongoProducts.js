const dbManager = require ("../../managers/mongo/MongoManager.js")

const productFile = require("../../models/product.js")

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

module.exports = MongoProduct