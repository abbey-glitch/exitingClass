const express = require("express")
const server = express()
const path = require("path")
const multer = require("multer")
const cookieParser = require("cookie-parser")
const session = require("express-session")
const bodyParser = require("body-parser")
const dotenv = require("dotenv")
dotenv.config()
const mongodb = require("mongodb")
const client = new mongodb.MongoClient(process.env.DB_URL)
const cors = require("cors")
const _id = new mongodb.ObjectId
// set up the install module
server.use(cors())
server.use(bodyParser.urlencoded({extended:false}))
server.use(express.static(path.join(__dirname, "public")))
server.use(session({secret:"your secret key"}))
server.use(cookieParser())
// set template engine
server.set("view engine", "ejs")
const database = process.env.DBNAME
const collection = process.env.TABLE
server.get("/", (req, res, next)=>{
    res.render("index")

})
server.get("/loginroute", function(req, res){
        res.render("form")
})
// set up multer
const storage = multer.diskStorage({
    destination:function(req, file, cb){
        cb(null, "public/uploads")
    },
    filename:function(req, file, cb){
        cb(null, file.originalname)
    }
})
const uploads = multer({storage:storage})

server.post("/loginroute", uploads.single("uploader"), async(req, res)=>{
    // if(req.file.size>= 2000){
    //     console.log('confirm image size');
    // }else{
    //     console.log('image size is lesser');
    // }
    const email = req.body.email.trim()
    const password = req.body.password.trim()
    const uploader = req.file.filename.trim()
    const img_url = req.file.path.trim()
    const obj = {
        email:email,
        password:password,
        uploader:uploader,
        img_url:img_url
    }
    req.session.user = obj
    const db = await client.db(database).collection(collection).insertOne(obj)
    if(db){
        res.send({
            message:"data inserted successfully",
            type:"success",
            data:obj
        })
    }else{
        res.send({
            message:"data not inserted"
        })
    }
})
// view all data
server.get("/view-users", async (req, res)=>{
    const db = await client.db(database).collection(collection).find({_id: "664b32af926c1e0386ad7f7e"})
    if(db){
        res.send({
            message:"data fetched successfully",
            data:db
        })
    }
})
// home
server.get("/homezone", (req, res)=>{
    if(req.session.user){
        res.send({
            message:"welcome"
        })
    }else{
        res.send({
            message:"please login"
        })
    }
})
// logout user
server.get("/logout", (req, res)=>{
    req.session.destroy()
    res.redirect("/homezone")
})
// set listen port
const connect = process.env.PORT
server.listen(connect, (error)=>{
    if(error){
        console.log("server error");
    }
    console.log(`server is listening on: ${connect}`);
})
