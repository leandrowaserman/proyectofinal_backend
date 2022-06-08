class Container {
    constructor(file){
        this.file = file
    }
    add = async(product) => {
        await this.file.create(product)
        return{status:"success", message:"New Product Created"}
    }
    getById = async(id) =>{
        if(!id) return{status:"error", error:"Id needed"}
        let search = await this.file.find({_id:id})
        if(search) return(search)
        return{status:"error", error:"product not found"}
    }
    getAll = async () =>{
        return await this.file.find()
    }
    getByMail = async(mail) =>{
        if(!mail) return{status:"error", error:"Mail needed"}
        let search = await UserModel.find({mail:mail})
        if(search) return(search)
        return{status:"error", error:"user not found"}
    }
    update = async(id, newProd)=>{
        if(!id || !newProd) return{status:"error", error:"data missing"}
        let exist = await this.file.find({_id:id})
        if(!exist) return{status:"error", error:"product not found"}
        if (newProd.name){
            await this.file.updateOne({_id:id}, {$set:{name:newProd.name}})
        }
        if(newProd.thumbnail){
            await this.file.updateOne({_id:id}, {$set:{thumbnail:newProd.thumbnail}})
        }
        if(newProd.price){
            await this.file.updateOne({_id:id}, {$set:{price:newProd.price}})
        }
        if(newProd.stock){
            await this.file.updateOne({_id:id}, {$set:{stock:newProd.stock}})
        }
        if(newProd.description){
            await this.file.updateOne({_id:id}, {$set:{description:newProd.description}})
        }
        return{status:"success", message:"Product Updated"}
    }
    deleteById = async(id) =>{
        if(!id) return{status:"error", error:"Id needed"}
        let products = await this.file.find()
        if (products.length===0)return{status:"error", error:"There are no Products"}
        await this.file.deleteOne({_id:id})
        return{status:"success",message:"Product Deleted"}
    }
    deleteAll = async() =>{
        let products = await this.file.find()
        if (products.length===0) return{status:"error", error:"There are no Products"}
        await this.file.deleteMany()
        return{status:"success",message:"All Products Deleted"}
    }
    // create = async() =>{
    //     let carts = await this.file.find()
    //     if(carts.length>=1){
    //         let newId = carts[carts.length-1]._id+1
    //         let newCart = Object.assign({_id:newId})
    //         await this.file.create(newCart)
    //         return{status:"success", message:"New Cart Created", id:newId}
    //     }
    //     let newCart = Object.assign({_id:1})
    //     await this.file.create(newCart)
    //     return{status:"success", message:"New Cart Created", id:1}
    // }
    addProduct = async (id, newProducts)=>{
        if(!id || !newProducts){
            return{status:"error", error:"data missing"}
        }
        let user = await this.file.findOne({_id:id})
        if(user){
            let testCart = user.cart
            testCart.products.push(newProducts)
            await this.file.updateOne({_id:id},{$set:{cart:testCart },})
            return{status:"success", message:"Products Added"}
        }
        return{status:"error", error:"cart not found"}
    }
    deleteProduct = async (id, id_prod)=>{
        if(!id || !id_prod){
            return{status:"error", error:"data missing"}
        }
        let cart = await this.file.find({_id:id})
        if(cart[0]){
            if(cart[0].products.length>=1){
                let search = await this.file.find({products:id_prod})
                if(!search.length) return{status:"error", error:"product not found on cart"}
                await this.file.updateOne({checkable_id:id}, {$pull: {products:id_prod}})
                
                return {status:"success", message:"Product deleted"}
            }
            return{status:"error", message:"there are no products on the cart"}
        }
    }
    getCart = async (id) =>{
        if(!id) return{status:"error",error:"data missing"}
        let user = await this.file.findOne({_id:id})
        if(user){
            let cart = user.cart
            return(cart)
        }
        return{status:"error", message:"user not found"}
    }
    emptyCart = async (id)=>{
        if(!id){
            return{status:"error", error:"data missing"}
        }
        let user = await this.file.findOne({_id:id})
        if(user){
            let testCart = user.cart
            testCart.products = []
            await this.file.updateOne({_id:id},{$set:{cart:testCart },})
            return{status:"success", message:"cart emptied"}
        }
        return{status:"error", error:"cart not found"}
    }
}
export default Container