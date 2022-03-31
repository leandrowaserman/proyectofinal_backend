let mongoose = require("mongoose")



let connection= () => {
    mongoose.connect('mongodb+srv://leandro:coderMongo123@codercluster18335.zfrfd.mongodb.net/ecommerce?retryWrites=true&w=majority',{
    useNewUrlParser:true,
    useUnifiedTopology:true
    },error => {
    if(error) throw new Error ('Can not connect to MongoDB')
    console.log("Connected to Data Base")
})}



module.exports = connection