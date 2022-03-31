const FsManager = require ("../../managers/fs/FsManager")

const pathToData = 'src/data/data.json'

class FsProduct{
    productManager = new FsManager(pathToData)
    add = async (product) =>{
        return await this.productManager.add(product)
    }
    update = async (product, id) =>{
        return await this.productManager.overwrite(product, id)
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

module.exports = FsProduct