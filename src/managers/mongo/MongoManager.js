import { CreateNewOrder, MessageAdmin, MessageUser } from "../../services/helpers.js"
import { areThereProductsMongo, checkIfExistsMongo, getByIdMongo, getByCategoryMongo, getMessagesByMail, getMessagesByType } from "../../services/mongo.services.js"

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
        let search = getByIdMongo(this.file,id)
        if(search) return(search)
        return{status:"error", error:"product not found"}
    }
    getAll = async () =>{
        return await this.file.find()
    }
    getByMail = async(mail) =>{
        if(!mail) return{status:"error", error:"Mail needed"}
        let search = await this.file.find({mail:mail})
        if(search) return(search)
        return{status:"error", error:"user not found"}
    }
    update = async(id, newProd)=>{
        if(!id || !newProd) return{status:"error", error:"data missing"}
        if(!checkIfExistsMongo(this.file,id)) return{status:"error", error:"product not found"}
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
        if(newProd.category){
            await this.file.updateOne({_id:id}, {$set:{description:newProd.category}})
        }
        return{status:"success", message:"Product Updated"}
    }
    deleteById = async(id) =>{
        if(!id) return{status:"error", error:"Id needed"}
        if (!areThereProductsMongo(this.file))return{status:"error", error:"There are no Products"}
        await this.file.deleteOne({_id:id})
        return{status:"success",message:"Product Deleted"}
    }
    deleteAll = async() =>{
        if (!areThereProductsMongo(this.file)) return{status:"error", error:"There are no Products"}
        await this.file.deleteMany()
        return{status:"success",message:"All Products Deleted"}
    }
    addProduct = async (user, newProducts)=>{
            if(!user|| !newProducts){
                return{status:"error", error:"data missing"}
            }

        if(user){
            let testCart = user.cart
            let index = testCart.products.findIndex(e=>e.prod_id == newProducts)
            if(index!=-1){
                testCart.products[index].quantity+=1
                console.log(testCart.products[index])
                await this.file.updateOne({_id:user._id},{$set: {cart:testCart},})
                return{status:"success", message:"Products Added"}
            }else{
                let newReq = {prod_id:newProducts, quantity:1}
                testCart.products.push(newReq)
                await this.file.updateOne({_id:user._id},{$set:{cart:testCart},})
                return{status:"success", message:"Products Added"}
            }
        }
        return{status:"error", error:"cart not found"}
    }
    addProductById = async (id, newProducts)=>{
    if(!id|| !newProducts){
        return{status:"error", error:"data missing"}
    }
    let user = await getByIdMongo(this.file,id)
    if(user){
        let testCart = user.cart
        let index = testCart.products.findIndex(e=>e.prod_id == newProducts)
        if(index!=-1){
            testCart.products[index].quantity+=1
            console.log(testCart.products[index])
            await this.file.updateOne({_id:user._id},{$set: {cart:testCart},})
            return{status:"success", message:"Products Added"}
        }else{
            let newReq = {prod_id:newProducts, quantity:1}
            testCart.products.push(newReq)
            await this.file.updateOne({_id:user._id},{$set:{cart:testCart},})
            return{status:"success", message:"Products Added"}
        }
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
    createOrder = async (user,products)=>{
        if(!user || !products){
            return{status:"error",error:"data missing"}
        }
        let previousOrders = await this.file.find()
        let id = previousOrders.length+1
        if(id===0){
            let newOrder = CreateNewOrder(user,products,1)
            await this.file.create(newOrder)
            return{status:"success",message:"New order created"}
        }
        let newOrder = await CreateNewOrder(user,products,id)
        await this.file.create(newOrder)
        return{status:"success",message:"New order created"}
    }
    findByCategory = async(category)=>{
        if(!category) return{status:"error",error:"data missing"}
        let search = getByCategoryMongo(this.file,category)
        if(search) return(search)
        return{status:"error", error:"products not found"}
    }
    sendMessage = async(message,user)=>{
        if(!message || !user) return{status:"error",error:"data missing"}
        if(typeof user === "object" || typeof user === "array" && user.rol=="user"){
            let newMessage = MessageUser(message, user)
            await this.file.create(newMessage)
            return{status:"success",message:"New message sent", type:"user"}
        }
        if(typeof user === "string"){
            let newMessage = MessageAdmin(message, user)
            await this.file.create(newMessage)
            return{status:"success",message:"New message sent", type:"system"}
        }
    }
    getMessagesUser = (user)=>{
        if(!user) return{status:"error",error:"data missing"}
        if(user.rol=="user"){
            let messages = getMessagesByMail(this.file,user.mail)
            return messages
        }else return{status:"error",message:"you are not an user"}
    }
    getMessagesAdmin = ()=>{
        let messages = getMessagesByType(this.file)
        return (messages)
    }
}
export default Container