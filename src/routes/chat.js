import express from "express"
import {loginAuth } from "../auth/authMiddleware.js";
import path from 'path';

const chatRouter = express.Router()

chatRouter.get("/",loginAuth,async(req,res)=>{
    res.sendFile(path.join(process.cwd(), 'src/public/views/chat.html'))
})

export default chatRouter