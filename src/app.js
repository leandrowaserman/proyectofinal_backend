const express = require('express')
const productRouter = require('./routes/Products')
const cartRouter = require('./routes/Cart')

const app = express()
app.use(express.urlencoded({extended:true}))
app.use(express.json())
app.use('/api/products',productRouter)
app.use('/api/cart',cartRouter)
app.get('*', function(req, res){
    res.send({error:-2, description:"ruta 'x' método 'y' no implementada"});
    }
)
const server = app.listen(8080, ()=>console.log("Listening on port 8080"))