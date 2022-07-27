import multer from "multer"
import path from "path"
import {fileURLToPath} from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let userStorage = multer.diskStorage({
    destination: function (req, file, callback) {
        callback(null, path.join(__dirname,'..','public','img','user'));
    },
    filename: function (req, file, callback) {
        let originalname = file.originalname.replace(/ /g, "")
        callback(null, Date.now()+"-"+originalname)
    }
});
let userUploader = multer({storage:userStorage})
let productStorage = multer.diskStorage({
    destination: function (req, file, callback) {
        callback(null, path.join(__dirname,'..','public','img','products'));
    },
    filename: function (req, file, callback) {
        let originalname = file.originalname.replace(/ /g, "")
        callback(null, Date.now()+"-"+originalname)
    }
});
let productUploader = multer({storage:productStorage})

export{
    productUploader,
    userUploader
}