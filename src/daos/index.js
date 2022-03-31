const MongoProducts = require('./products/MongoProducts.js')
const FsProducts = require('./products/FsProducts.js')

const MongoCart = require('./carts/MongoCart.js')
const FsCart = require('./carts/FsCart.js')

const connection = require('../config/config.js');

const dbToUse = 'mongo' // "mongo" para usar mongo y "fs" para fs

let productDao
let cartDao

switch (dbToUse) {
    case 'mongo':
        connection()
        productDao = new MongoProducts()
        cartDao = new MongoCart()
        break;
    case 'fs':
        productDao = new FsProducts()
        cartDao = new FsCart()
        break
    default:
        break;
}
module.exports = {productDao, cartDao}