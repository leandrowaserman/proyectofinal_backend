import dbManager from "../../managers/mongo/MongoManager.js"
import OrderModel from "../models/order.js"

class MongoOrder {
    OrderManager = new dbManager(OrderModel)
    createOrder = async (user, products) =>{
        return await this.OrderManager.createOrder(user, products)
    }
}

export default MongoOrder