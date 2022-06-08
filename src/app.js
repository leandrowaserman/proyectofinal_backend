import express from "express"
import productRouter from './routes/Products.js'
import {Server as IOserver} from 'socket.io'
import path from 'path';
import {fileURLToPath} from 'url';
import registerRouter from "./routes/Register.js"
import cookieParser from 'cookie-parser'
import compression from "compression"
import MongoStore from 'connect-mongo'
import session from 'express-session'
import passport from 'passport'
import passportLocal from 'passport-local'
import bcrypt from 'bcrypt'
import { productDao, userDao } from "./daos/index.js";
import { loggerError, loggerTrace, loggerWarn} from "./services/logger.js"
import loginRouter from "./routes/Login.js"
import UserModel from "./models/user.js";
import multer from "multer"
import {cartMessage,newOrderMail,newOrderWhatsapp,registrationEmail} from "./services/send.js"
import MODE from "./config/mode.js";
import ProductModel from "./models/product.js";
import cluster from "cluster";
import os from "os"
import http from "http"
import apiRouter from "./routes/api.js";

const LocalStrategy = passportLocal.Strategy
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express()
const PORT = process.env.PORT || 8080
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





let userStorage = multer.diskStorage({
    destination: function (req, file, callback) {
        callback(null, __dirname+'/public/img/user');
    },
    filename: function (req, file, callback) {
        let originalname = file.originalname.replace(/ /g, "")
        callback(null, Date.now()+"-"+originalname)
    }
});
let userUploader = multer({storage:userStorage})
let productStorage = multer.diskStorage({
    destination: function (req, file, callback) {
        callback(null, __dirname+'/public/img/products');
    },
    filename: function (req, file, callback) {
        let originalname = file.originalname.replace(/ /g, "")
        callback(null, Date.now()+"-"+originalname)
    }
});
let productUploader = multer({storage:productStorage})

//cookies
app.use(session({
    store:MongoStore.create({
        mongoUrl:'mongodb+srv://leandro:coderMongo123@codercluster18335.zfrfd.mongodb.net/ecommerce?retryWrites=true&w=majority',
        ttl:600
    }),
    secret:"s8fyas9fyasfhaisr89",
    resave:true,
    saveUninitialized:false, 
}))
app.use(passport.initialize())
app.use(passport.session())



// nodemailer

//bcrypt
const createHash = (password)=>{
    return bcrypt.hashSync(
        password,
        bcrypt.genSaltSync(10)
    )
}

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
                registrationEmail(userCreated)
                return done(null,userCreated)
            })

        })
    }
))

// RUTAS

app.use('/favicon.ico', (req, res) => res.status(204)) // para que no salte en el logger
app.get('/socket.io/socket.io.js', (req, res) => {
    res.sendFile(path.join(__dirname,'..','node_modules','socket.io','client-dist','socket.io.js'));
});

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
app.get('/logout', function(req, res) {
    const user = req.session?.passport.user
    if (user) {
        let name = user.username
        req.session.destroy(err => {
            if (err) { 
                res.redirect('/')
                
            } else {
               res.send(`<a href="http://localhost:8080/login">login</a><p>${name}, te has desconectado.</p>`) 
            }
        })
    } else {
        res.redirect('/')
    }

})

// Perfil
app.get("/profile",(req,res)=>{
    let user = req.session.passport?.user
    console.log(req.headers.host)
    if(user) res.send(`<a href="http://localhost:8080">volver al inicio</a><h1>Tu perfil</h1><br><img src=${user.avatar}><br><p>nombre completo: ${user.name} ${user.last_name} </p><br><p>mail: ${user.mail}</p><br><p>username: ${user.username}</p><br><p>edad: ${user.age}</p>`)
    else res.redirect("/")
})

app.use(express.static(__dirname+'/public'))


// Carrito
app.get("/cart",async(req,res)=>{
    let id = req.session.passport?.user._id
    if(!id) res.redirect("/login")
    else{
        let cart = await userDao.getCart(id)
        let productsId = cart.products
        if(productsId.length==0)res.send(`<a href="http://localhost:8080">volver al inicio</a><h1>Carrito</h1><p>No hay productos</p>`)
        else{  
            let cartProducts = []
            await Promise.all (productsId.map   (async (products)=>{
                let newProduct = await productDao.getById(products)
                cartProducts.push(newProduct)
            }))
            res.send(`<a href="http://localhost:8080">volver al inicio</a>
                <h1>Carrito</h1>
                <pre>
                <code>${cartProducts}</code>
                </pre>
                <br>
                <form action="/checkout" method="post">
                <input type="submit" name="sendCart" value="Comprar" />
                </form>`
            )

        }

    }

})
app.post("/checkout",async(req,res)=>{
    let id = req.session.passport?.user._id
    if(!id) res.send(`<a href="http://localhost:8080/login">log in</a><p>No estas logueado</p>`)
    let cart = await userDao.getCart(id)
    let productsId = cart.products
    if(productsId.length==0)res.send(`<a href="http://localhost:8080">volver al inicio</a><h1>Carrito</h1><p>No hay productos</p>`)
    let cartProducts = []
    await Promise.all (productsId.map   (async (products)=>{
        let newProduct = await productDao.getById(products)
        cartProducts.push(newProduct)
    }))
    await newOrderMail(req.session.passport.user.name, req.session.passport.user.mail, cartProducts)
    await newOrderWhatsapp(req.session.passport.user.name, req.session.passport.user.mail, cartProducts)
    let phone = req.session.passport.user.phone
    cartMessage(phone.number, phone.prefix)
    await userDao.emptyCart(id)
    res.redirect("/")
})

//productos
app.use("/products",productRouter)  
app.post('/productsForm',productUploader.single('file'),async(req,res)=>{
    let filename = req.file.filename.replace(/ /g, "")
    const newProduct = {
        name:req.body.name,
        thumbnail:req.protocol+"://"+req.headers.host+"/img/products/"+filename,
        stock:req.body.stock,
        price:req.body.price,
        description:req.body.description
    }
    await productDao.add(newProduct)
    res.redirect("/")
})


app.use("/api",apiRouter)


//socket
io.on('connection',async socket=>{
    let products = await productDao.getAll()
    io.emit('productLog',products)
    io.emit('userCheck')
    socket.on('sendProduct',async data=>{
        await productDao.add(data)
        let products = await productDao.getAll()
        io.emit('productLog',products)
    })
    socket.on("sendUser", async (data)=>{
        await userDao.add(data)
    })
    socket.on("productCart",async(id_prod, user)=>{
        await userDao.addProduct(user._id,id_prod)
        loggerTrace.trace(`producto con id ${id_prod} agregado al usuario de ${user.username}`)
    })

})

// para detectar si alguien intento entrar a una ruta no establecida
app.get('*', function(req, res){
    res.send({status:"error", description:`ruta ${req.url} método ${req.method} no implementada`});
})
