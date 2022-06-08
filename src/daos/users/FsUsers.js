import FsManager from "../../managers/fs/FsManager.js"

const pathToUsers = 'src/data/user.json'

class FsUsers{
    UserManager = new FsManager(pathToUsers)
    add = async (user) =>{
        return await this.UserManager.add(user)
    }
    getByMail = async (mail)=>{
        return await this.UserManager.getByMail(mail)
    }
}

export default FsUsers