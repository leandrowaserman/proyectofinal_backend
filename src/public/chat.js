const socket = io();
let chatLog = document.getElementById("chatLog");


socket.on('chatLog',(messages)=>{
    fetch('/api/user')
    .then(async function(r){
        let data = await r.json()
        if(data.username) return data
        else return null
    }
    ).then(data=>{
        if(data!=null){
            if(data.rol=="user"){
                let newMessages = messages.filter(message => message.email == data.mail)
                fetch('./templates/chatLogUser.handlebars').then(response=>{
                    return response.text()
                }).then(template=>{
                    const processedTemplate = Handlebars.compile(template)
                    const html = processedTemplate({newMessages})
                    chatLog.innerHTML = html
                    const sendMessageUser = document.getElementById("sendMessageUser")
                    sendMessageUser.addEventListener("submit", e=>{
                        e.preventDefault()
                        let message = sendMessageUser[0].value
                        fetch('/api/user')
                        .then(async function(r){
                            let data = await r.json()
                            if(data.username) return data
                            else return null
                        }
                        ).then(data=>{
                            socket.emit("newMessage",message,data)
                        })
                    })
                })
            }else{
                let newMessages = messages.filter(message => message.type == "user")
                fetch('./templates/chatLogAdmin.handlebars').then(response=>{
                    return response.text()
                }).then(template=>{
                    const processedTemplate = Handlebars.compile(template)
                    const html = processedTemplate({newMessages})
                    chatLog.innerHTML = html
                    const sendMessageAdmin = document.getElementById("sendMessageAdmin")
                    sendMessageAdmin.addEventListener("submit", e=>{
                        e.preventDefault()
                        let message = sendMessageAdmin[1]
                        let mail = sendMessageAdmin[0]
                        socket.emit("newMessage",message,mail)
                        sendMessageAdmin.reset()
                    })
                })
            }
        }

    })
})

Handlebars.registerHelper('iff', function(a, operator, b, opts) { // para que funcione el iff en handlebars
    var bool = false;
    switch(operator) {
       case '==':
           bool = a == b;
           break;
       case '>':
           bool = a > b;
           break;
       case '<':
           bool = a < b;
           break;
       default:
           throw "Unknown operator " + operator;
    }
 
    if (bool) {
        return opts.fn(this);
    } else {
        return opts.inverse(this);
    }
});