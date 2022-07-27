import mongoose from "mongoose"
import { loggerTrace } from "../../../utils/logger.js"
import dotenv from "dotenv"

dotenv.config()

let connection= () => {
    mongoose.connect(process.env.MONGO_URL,{
    useNewUrlParser:true,
    useUnifiedTopology:true
    },error => {
    if(error) throw new Error ('Can not connect to MongoDB')
    loggerTrace.trace("Connected to MongoDB Atlas")
})}



export default connection