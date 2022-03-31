class Container {
    constructor(file){
        this.file = file
    }
    add = async(product) => {
        let products = await this.file.find()
        if(products.length>=1){
            let newId = products[products.length-1].checkable_id+1
            let newProduct = Object.assign({checkable_id:newId},product)
            await this.file.create(newProduct)
            return{status:"success", message:"New Product Created", id:newId}
        }            
        let newProduct = Object.assign({checkable_id:1},product)
        await this.file.create(newProduct)
        return{status:"success", message:"New Product Created", id:1}
    }
    getById = async(id) =>{
        if(!id) return{status:"error", error:"Id needed"}
        return await this.file.find({checkable_id:id})
    }
    getAll = async () =>{
        return await this.file.find()
    }
    update = async(id, newProd)=>{
        if(!id || !newProd) return{status:"error", error:"data missing"}
        let exist = await this.file.find({checkable_id:id})
        if(!exist) return{status:"error", error:"product not found"}
        if (newProd.name){
            await this.file.updateOne({checkable_id:id}, {$set:{name:newProd.name}})
        }
        if(newProd.thumbnail){
            await this.file.updateOne({checkable_id:id}, {$set:{thumbnail:newProd.thumbnail}})
        }
        if(newProd.price){
            await this.file.updateOne({checkable_id:id}, {$set:{price:newProd.price}})
        }
        if(newProd.stock){
            await this.file.updateOne({checkable_id:id}, {$set:{stock:newProd.stock}})
        }
        if(newProd.description){
            await this.file.updateOne({checkable_id:id}, {$set:{description:newProd.description}})
        }
        return{status:"success", message:"Product Updated"}
    }
    deleteById = async(id) =>{
        if(!id) return{status:"error", error:"Id needed"}
        let products = await this.file.find()
        if (products.length===0)return{status:"error", error:"There are no Products"}
        await this.file.deleteOne({checkable_id:id})
        return{status:"success",message:"Product Deleted"}
    }
    deleteAll = async() =>{
        let products = await this.file.find()
        if (products.length===0) return{status:"error", error:"There are no Products"}
        await this.file.deleteMany()
        return{status:"success",message:"All Products Deleted"}
    }
    create = async() =>{
        let carts = await this.file.find()
        if(carts.length>=1){
            let newId = carts[carts.length-1].checkable_id+1
            let newCart = Object.assign({checkable_id:newId})
            await this.file.create(newCart)
            return{status:"success", message:"New Cart Created", id:newId}
        }
        let newCart = Object.assign({checkable_id:1})
        await this.file.create(newCart)
        return{status:"success", message:"New Cart Created", id:1}
    }
    addProduct = async (id, newProducts)=>{
        if(!id || !newProducts){
            return{status:"error", error:"data missing"}
        }
        let cart = await this.file.find({checkable_id:id})
        if(cart){
            await this.file.updateOne({checkable_id:id},{$push:{products:{$each: newProducts} 
            },})
            return{status:"success", message:"Products Added"}
        }
        return{status:"error", error:"cart not found"}
    }
    deleteProduct = async (id, id_prod)=>{
        if(!id || !id_prod){
            return{status:"error", error:"data missing"}
        }
        let cart = await this.file.find({checkable_id:id})
        if(cart){
            if(cart.products.length==0){
                return{status:"error", message:"there are no products on the cart"}
            }else{
                await this.file.updateOne({checkable_id:id}, {$pull: {products:id_prod}})
                return {status:"success", message:"Product deleted"}
            }
        }
    }
}
module.exports = Container