import MongoProducts from './products/MongoProducts.js'
import MongoOrder from './orders/MongoOrders.js';
import MongoUsers from './users/MongoUsers.js';
import MongoChat from './chat/MongoChat.js';

import connection from './models/config/config.js';

import dotenv from "dotenv"

dotenv.config()


const dbToUse = process.env.DB_TO_USE // para detectar, en un futuro, que persistencia usar (mediante variable de entorno)

let productDao
let userDao
let orderDao
let chatDao

switch (dbToUse) {
    case 'mongo':
        connection()
        productDao = new MongoProducts()
        userDao = new MongoUsers()
        orderDao = new MongoOrder()
        chatDao = new MongoChat()
        break;
    default:
        break;
}
export {
    productDao,
    userDao,
    orderDao,
    chatDao
}

