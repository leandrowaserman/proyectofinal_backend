const FsManager = require ("../../managers/fs/FsManager")

const pathToCart = 'src/data/cart.json'

class FsCart{
    CartManager = new FsManager(pathToCart)
    create = async () =>{
        return await this.CartManager.create()
    }
    deleteById = async(id) =>{
        return await this.CartManager.deleteById(id)
    }
    getById = async (id) =>{
        return await this.CartManager.getById(id)
    }
    addProduct = async (id, newProducts) =>{
        return await this.CartManager.addProduct(id, newProducts)
    }
    deleteProduct = async(id, id_prod)=>{
        return await this.CartManager.deleteProduct(id, id_prod)
    }
}

module.exports = FsCart