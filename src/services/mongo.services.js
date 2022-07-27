const checkIfExistsMongo = async(path, id) =>{
    let exists = await path.find({_id:id})
    if (exists) return true
    return false
}
const getByIdMongo = async(path,id)=>{
    let search = await path.find({_id:id})
    if(search) return (search)
    return false
}
const areThereProductsMongo = async(path) =>{
    let products = await path.find()
    if(products.length===0) return false
    return true
}
const getByCategoryMongo = async(path,category) =>{
    let products = await path.find({category:category})
    if(products) return (products)
    return false
}
const getMessagesByMail = async(path,mail)=>{
    let messages = await path.find({email:mail})
    if(messages) return messages
    return false
}
const getMessagesByType = async(path)=>{
    let messages = await path.find({type:"system"})
    if(messages) return messages
    return false
}
export{
    checkIfExistsMongo,
    getByIdMongo,
    areThereProductsMongo,
    getByCategoryMongo,
    getMessagesByMail,
    getMessagesByType
}