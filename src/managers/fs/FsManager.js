import fs from 'fs'

class Container{
    constructor(ruta){
        this.ruta = ruta
    }
    add = async(product) => {
        if(!product.name || !product.price || !product.thumbnail || !product.stock || !product.description){
            return{status:"error", error:"faltan completar datos"}
        }
        try{
            if(fs.existsSync(this.ruta)){
                let data = await fs.promises.readFile(this.ruta,'utf-8')
                let products = JSON.parse(data)
                if(products.length===0){
                    let newProduct = Object.assign({id:1, timestamp:Date.now()},product)
                    await fs.promises.writeFile(this.ruta, JSON.stringify([newProduct], null, 2)) 
                    return{status:"success", message:"New Product Created", id:1}
                }else{
                    let newId = products[products.length-1].id+1
                    product.id = newId
                    product.timestamp=Date.now()
                    products.push(product)
                    await fs.promises.writeFile(this.ruta, JSON.stringify(products,null,2))
                    return{status:"success", message:"New Product Created", id:newId} 
                }
            }else{
                let newProduct = Object.assign({id:1, timestamp:Date.now()},product)
                await fs.promises.writeFile(this.ruta, JSON.stringify([newProduct], null, 2)) 
                return{status:"success", message:"New Product Created", id:1}
            }
        }
        catch(error){
            return{status:"error", message:error}
        }
    }
    overwrite = async(product, id)=>{
        let data = await fs.promises.readFile(this.ruta,'utf-8')
        let products = JSON.parse(data)
        let productsNotId = products.filter(u => u.id !== id)
        let newProduct = Object.assign({id:id},product)
        productsNotId.push(newProduct)
        await fs.promises.writeFile(this.ruta, JSON.stringify(productsNotId,null,2))
        return{status:"success", message:"Product Modified", id:id}
    }
    getById = async(id)=>{
        if(fs.existsSync(this.ruta)){
            let data = await fs.promises.readFile(this.ruta,'utf-8')
            let products = JSON.parse(data)
            let product = products.find(u => u.id === id)
            if(product){
                return(product)
            }
            else{
                return{status:"error", error:"Product not found"}
            }
        }
    }
    getAll = async () =>{
        if(fs.existsSync(this.ruta)){
            let data = await fs.promises.readFile(this.ruta,'utf-8')
            let products = JSON.parse(data)
            return(products)
        }
    }
    getByMail = async(mail)=>{
        if(fs.existsSync(this.ruta)){
            let data = await fs.promises.readFile(this.ruta,'utf-8')
            let products = JSON.parse(data)
            let product = products.find(u => u.mail === mail)
            if(product) return(product)
            return{status:"error", error:"user not found"}
        }return{status:"error",message:"no database found"}
    }
    deleteById = async (id) =>{
        if(!id){
            return{status:"error", error:"Id needed"}
        }
        if(fs.existsSync(this.ruta)){
            let data = await fs.promises.readFile(this.ruta,'utf-8')
            let products = JSON.parse(data)
            let newProducts = products.filter(u => u.id !== id)
            await fs.promises.writeFile(this.ruta,JSON.stringify(newProducts,null,2))
            return{status:"success",message:"Product Deleted"}
        }
    }
    deleteAll = async () =>{
        if(fs.existsSync(this.ruta)){
            let data = await fs.promises.readFile(this.ruta,'utf-8')
            let products = JSON.parse(data)
            if(products==''){
                return{status:"error", error:"There are no Products"}
            }else{
                await fs.promises.writeFile(this.ruta,'')
                return{status:"success",message:"All Products Deleted"}
            }
        }else{
            return{status:"error", error:"The file doesnt exist"}
        }
        
    }
    create = async() =>{
        if(fs.existsSync(this.ruta)){
            let data = await fs.promises.readFile(this.ruta,'utf-8')
            let items = JSON.parse(data)
            if(items.length===0){
                let newCart = Object.assign({id:1, timestamp:Date.now(), products:[]})
                await fs.promises.writeFile(this.ruta, JSON.stringify([newCart], null, 2)) 
                return{status:"success", message:"New Cart Created", id:1}
            }else{
                let newId = items[items.length-1].id+1
                let newCart = {}
                newCart.id = newId
                newCart.timestamp=Date.now()
                newCart.products=[]
                items.push(newCart)
                await fs.promises.writeFile(this.ruta, JSON.stringify(items,null,2))
                return{status:"success", message:"New Cart Created", id:newId} 
            }
        }else{
            let newCart = Object.assign({id:1, timestamp:Date.now(), products:[]})
            await fs.promises.writeFile(this.ruta, JSON.stringify([newCart], null, 2)) 
            return{status:"success", message:"New Cart Created", id:1}
        }
    }
    addProduct = async (id, newProducts)=>{
        if(!id || !newProducts){
            return{status:"error", error:"data missing"}
        }
        else{
            let data = await fs.promises.readFile(this.ruta,'utf-8')
            let items = JSON.parse(data)
            let cart = items.find(u => u.id === id)
            if(cart){
                if(cart.products.length == 0){
                    let timestamp = cart.timestamp
                    let cartsNotId = items.filter(u => u.id !== id)
                    let newCart = Object.assign({id:id, timestamp:timestamp, products:newProducts})
                    cartsNotId.push(newCart)
                    await fs.promises.writeFile(this.ruta, JSON.stringify(cartsNotId,null,2))
                    return{status:"success", message:"Products Added"}
                }else{
                    let timestamp = cart.timestamp
                    let products = cart.products
                    let cartsNotId = items.filter(u => u.id !== id)
                    let newerProducts = products.concat(newProducts)
                    let newCart = Object.assign({id:id, timestamp:timestamp, products:newerProducts})
                    cartsNotId.push(newCart)
                    await fs.promises.writeFile(this.ruta, JSON.stringify(cartsNotId,null,2))
                    return{status:"success", message:"Products Added"}
                }
            }
            else{
                return{status:"error", error:"Cart not found"}
            }
        }
        
    }
    deleteProduct = async (id, id_prod)=>{
        let data = await fs.promises.readFile(this.ruta,'utf-8')
        let items = JSON.parse(data)
        let cart = items.find(u => u.id === id)
        if(cart){
            if(cart.products.length == 0){
                return{status:"error", message:"there are no products on the cart"}
            }else{
                let timestamp = cart.timestamp
                let products = cart.products
                let cartsNotId = items.filter(u => u.id !== id)
                let newProducts = products.filter(u => u !== id_prod)
                let newCart = Object.assign({id:id, timestamp:timestamp, products:newProducts})
                cartsNotId.push(newCart)
                await fs.promises.writeFile(this.ruta, JSON.stringify(cartsNotId,null,2))
                return {status:"success", message:"Product deleted"}
            }
        }
        else{
            return{status:"error", error:"Cart not found"}
        }

    }
}
export default Container