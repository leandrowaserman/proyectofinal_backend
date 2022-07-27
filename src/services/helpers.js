const CreateNewOrder = (user, products, id)=>{
    let newOrder = {
        user:{
            mail:user.mail,
            name:user.name,
            last_name:user.last_name,
            age:user.age,
            username:user.username,
            phone:user.phone
        },
        products:products,
        order_id:id
    }
    return newOrder
}
const MessageUser = (message, user)=>{
    let newMessage = {
        email: user.mail,
        type:"user",
        message:message
    }
    return newMessage
}

const MessageAdmin = (message, mail)=>{
    let newMessage = {
        email: mail,
        type:"system",
        message:message
    }
    return newMessage
}


const cartDisplay = (cartProducts)=>{
    let disp = `<a href="/">volver al inicio</a>
    <h1>Carrito</h1>
    ${cartProducts.map((item=>
        `
        <div>
        <tr>
            <td className="tabla">Nombre: ${item.name}</td>
            <td className="tabla">Precio: ${item.price}</td>
            <td className="tabla">Cantidad: ${item.quantity}</td>
        </tr>
        </div>
        `))}
    <br>
    <form action="/cart/checkout" method="post">
    <input type="submit" name="sendCart" value="Comprar" />
    </form>
    <form action="/cart/delete" method="POST">
    <input type="submit" value="Borrar Carrito" />
    </form>
    `
    return disp
}

const mailDisplay = (user, data)=>{
    let disp = `<a href="/">volver al inicio</a>
    <h1>Pedido de ${user.mail}</h1>
    ${data.map((item=>
        `
        <div>
        <tr>
            <td className="tabla">Nombre: ${item[0].name}</td>
            <td className="tabla">Precio: ${item[0].price}</td>
            <td className="tabla">Cantidad: ${item.quantity}</td>
        </tr>
        </div>
        `))}

    `
    return disp
} 
const whatsappDisplay = (user, data)=>{
    let disp = `Pedido de ${user.name} / mail: ${user.mail}
    ${data.map((item=>
        `
        Producto: ${item[0].name}
        Precio: ${item[0].price}
        Cantidad:${item.quantity}
        `))}

    `
    return disp
}

export {CreateNewOrder, MessageUser, MessageAdmin, cartDisplay, mailDisplay, whatsappDisplay}