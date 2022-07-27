import bcrypt from 'bcrypt'

const createHash = (password)=>{
    return bcrypt.hashSync(
        password,
        bcrypt.genSaltSync(10)
    )
}

export default createHash