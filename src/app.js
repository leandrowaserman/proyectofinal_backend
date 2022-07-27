import express from "express"
import {Server as IOserver} from 'socket.io'
import path from 'path';
import {fileURLToPath} from 'url';
import cookieParser from 'cookie-parser'
import compression from "compression"
import MongoStore from 'connect-mongo'
import session from 'express-session'
import passport from 'passport'
import passportLocal from 'passport-local'
import bcrypt from 'bcrypt'
import cluster from "cluster";
import os from "os"
import dotenv from "dotenv"

import { chatDao, productDao, userDao } from "./daos/index.js";
import { loggerError, loggerTrace} from "./utils/logger.js"
import registerRouter from "./routes/Register.js"
import loginRouter from "./routes/Login.js"
import {UserModel} from "./daos/models/user.js";
import {registrationEmail} from "./utils/messaging.js"
import apiRouter from "./routes/api.js";
import cartRouter from "./routes/cart.js";
import logoutRouter from "./routes/logout.js";
import profileRouter from "./routes/profile.js";
import { productUploader, userUploader } from "./utils/multer.js";
import productsRouter from "./routes/products.js";
import createHash from "./utils/bcrypt.js";
import chatRouter from "./routes/chat.js";


const LocalStrategy = passportLocal.Strategy
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config() 
const app = express()
const PORT = process.env.PORT
let MODE
if(process.env.DEV_MODE=="produccion"){
    MODE = process.argv.slice(2) || "fork"
}else{
    MODE = "fork"
}
let server
if(MODE=="cluster"){
    const totalCPUs = os.cpus().length
    if(cluster.isPrimary){

        for(let i=0; i<totalCPUs;i++){
            cluster.fork()
        }
        cluster.on("exit",(worker, code, signal)=>{
            loggerError.error(`the ${worker.process.pid} process stopped working`)
            cluster.fork()
        })
    }else{
        server = app.listen(PORT, ()=>loggerTrace.trace(`Listening on port ${PORT} with process ${process.pid} on mode ${MODE}`))
        
    }
}else{
    server = app.listen(PORT, ()=>loggerTrace.trace(`Listening on port ${PORT} with process ${process.pid}`))
}
const io = new IOserver(server);

app.set('view engine', 'handlebars')

app.use(compression())
app.use(cookieParser())
app.use(express.urlencoded({extended:true}))
app.use(express.json())

//cookies
app.use(session({
    store:MongoStore.create({
        mongoUrl:process.env.MONGO_URL,
        ttl:600
    }),
    secret:process.env.COOKIE_SECRET,
    resave:true,
    saveUninitialized:false, 
}))
app.use(passport.initialize())
app.use(passport.session())


// passport
passport.serializeUser(function(user, done) {
    done(null, user);
  });
  
passport.deserializeUser(function(user, done) {
   done(null, user);
});

passport.use('login', new LocalStrategy(
    {
        passReqToCallback: true
    },
    function(req, username, password, done){

        UserModel.findOne({username:username},(err,userFound)=>{
            if(err) return done(err);
            if(!userFound) return done(null, false, {message:"user does not exists"})
            if(!bcrypt.compareSync(password, userFound.password)){
                return done(null, false,{message:"password does not match"})
            }
            req.session.user = userFound
            done(null, userFound);
        })
    }
))

passport.use('register', new LocalStrategy(
    {
        passReqToCallback:true
    },
    (req,username,password,done)=>{
        UserModel.findOne({mail:req.body.mail}, async(err,user)=>{
            if(err) return done(err)
            if(user) return done(null, false, {message:"user already exists"});
            let filename = req.file.filename.replace(/ /g, "")
            const newUser = {
                mail:req.body.mail,
                name: req.body.name,
                last_name:req.body.last_name,
                age:req.body.age,
                username: username,
                avatar:req.protocol+"://"+req.headers.host+"/img/user/"+filename,
                phone:{
                    prefix:req.body.prefix,
                    number:req.body.number
                },
                cart:{
                    products:[]
                },
                password: createHash(password),
                rol:req.body.rol
            }
            UserModel.create(newUser, async(err,userCreated)=>{
                if(err) return done(err);
                registrationEmail()
                return done(null,userCreated)
            })

        })
    }
))



app.use('/favicon.ico', (req, res) => res.status(204)) // para que no salte en el logger

app.use(express.static(__dirname+'/public'))


// home
app.get("/",(req,res)=>{
    const user = req.session.passport?.user
    if(user){res.redirect("/products")} 
    else{res.redirect("/login")}
})


// registro
app.use('/register', registerRouter)
app.post('/registerForm',userUploader.single('file'),passport.authenticate('register',{
    failureRedirect:'/register/error'
}), (req,res)=>{
    res.redirect('/login')
})


// login
app.use('/login', loginRouter)
app.post("/loginForm",passport.authenticate('login',{
    failureRedirect:'/login/error'
}), (req,res)=>{
    res.redirect('/')
})
app.use('/logout', logoutRouter)


// Perfil
app.use("/profile",profileRouter)




// Carrito
app.use("/cart",cartRouter)

//productos
app.post('/productsForm',productUploader.single('file'),async(req,res)=>{
    let filename = req.file.filename.replace(/ /g, "")
    let category = req.body.category
    const newProduct = {
        name:req.body.name,
        thumbnail:req.protocol+"://"+req.headers.host+"/img/products/"+filename,
        stock:req.body.stock,
        price:req.body.price,
        description:req.body.description,
        category:category.toLowerCase()
    }
    await productDao.add(newProduct)
    res.redirect("/")
})
app.use("/products",productsRouter) 

// chat admin-user
app.use("/chat",chatRouter) 


// data
app.use("/api",apiRouter)


//socket
io.on('connection',async socket=>{
    let products = await productDao.getAll()
    io.emit('productLog',products)
    io.emit('userCheck')
    let messages = await chatDao.getAll()
    io.emit('chatLog',messages)
    socket.on('sendProduct',async data=>{
        await productDao.add(data)
        let products = await productDao.getAll()
        io.emit('productLog',products)
    })
    socket.on("sendUser", async (data)=>{
        await userDao.add(data)
    })
    socket.on("productCart",async(id_prod, user)=>{
        await userDao.addProduct(user,id_prod)
        loggerTrace.trace(`producto con id ${id_prod} agregado al usuario de ${user.username}`)
    })
    socket.on("newMessage", async(message,user)=>{
        await chatDao.sendMessage(message,user)
        let messages = await chatDao.getAll()
        io.emit("chatLog",messages)
    })

})

// para detectar si alguien intento entrar a una ruta no establecida
app.get('*', function(req, res){
    res.status(404).send({status:"error", description:`ruta ${req.url} método ${req.method} no implementada`});
})
