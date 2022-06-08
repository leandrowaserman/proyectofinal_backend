import MongoProducts from './products/MongoProducts.js'
import FsProducts from './products/FsProducts.js'

import MongoUsers from './users/MongoUsers.js';
import FsUsers from './users/FsUsers.js';

import connection from '../config/config.js';
import { loggerWarn } from '../services/logger.js';



const dbToUse = 'mongo' // "mongo" para usar mongo y "fs" para fs

let productDao
let userDao

switch (dbToUse) {
    case 'mongo':
        connection()
        productDao = new MongoProducts()
        userDao = new MongoUsers()
        break;
    case 'fs':
        productDao = new FsProducts()
        userDao = new FsUsers()
        loggerWarn.warn("Filesystem not 100% implemented. You might have problems using the app.")
        break
    default:
        break;
}
export {
    productDao,
    userDao
}

