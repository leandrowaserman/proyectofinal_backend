const socket = io();
let productForm = document.getElementById("productForm");


socket.on('userCheck',()=>{
    let linksIndex = document.getElementById("linksIndex")
    fetch('/api/user')
    .then(async function(r){
        let data = await r.json()
        if(data.username) return data
        else return null
    }
    ).then(data=>{
        if(data!=null){
            let size = Object.keys(data).length
            if(!size)return
            if(data.rol=="user"){
                fetch('./templates/userconnected.handlebars').then(response=>{
                    return response.text()
                }).then(template=>{
                    const processedTemplate = Handlebars.compile(template)
                    const html = processedTemplate(data)
                    linksIndex.innerHTML = html
                })
            }
            if(data.rol=="admin"){
                fetch('./templates/adminconnected.handlebars').then(response=>{
                    return response.text()
                }).then(template=>{
                    const processedTemplate = Handlebars.compile(template)
                    const html = processedTemplate(data)
                    linksIndex.innerHTML = html
                })
            }
        }

    })
})

// productos
function fetchProducts(products){
    let productsTemplate = document.getElementById("productsTemplate");
    fetch('templates/newestProducts.handlebars').then(response=>{
        return response.text();
    }).then(template=>{
        const processedTemplate = Handlebars.compile(template);
        const html = processedTemplate({products})
        productsTemplate.innerHTML = html;
    })
}
function takeValue(){
    let productsTemplate = document.getElementById("productsTemplate");
    productsTemplate.innerHTML=``
    fetch('/api/products')
    .then(async function(r){
        let data = await r.json()
        return data
    }
    ).then(data=>{
        if(data!=null){
            let filter = document.getElementById("filter")
            let filterExe = filter.value
            let applied
            if(filterExe == "lower1000"){
                applied = data.filter(data=>{ return data.price >= 1000})
                fetchProducts(applied)
            }
            if(filterExe == "higher1000"){
                applied = data.filter(data=>{ return data.price <= 1000})
                fetchProducts(applied)
            }
            if(filterExe == "all"){
                applied = data
                fetchProducts(applied)
            }
        }

    })

}


socket.on('productLog',(data)=>{
    let products = data
    let productsTemplate = document.getElementById("productsTemplate");
    fetch('templates/newestProducts.handlebars').then(response=>{
        return response.text();
    }).then(template=>{
        const processedTemplate = Handlebars.compile(template);
        const html = processedTemplate({products})
        productsTemplate.innerHTML = html;
    })
})
function addCart (id){
    fetch('/api/user')
    .then(async function(r){
        let data = await r.json()
        if(data.username) return data
        else return null
    }).then(user=>{
        if(user != null){
            socket.emit("productCart",id, user)
        }
    })

}

