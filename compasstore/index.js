const express = require("express")
const server = express()
const path = require("path")
const bodyParser = require("body-parser")
const cookieParser = require("cookie-parser")

const client = require("mongodb").MongoClient
const cors = require("cors")
const dotenv = require("dotenv")
dotenv.config()
const bcrypt = require("bcrypt")
server.use(cors())
server.use(express.static(path.join(__dirname, "public")))
server.use(bodyParser.urlencoded({extended:true}))
server.use(cookieParser())
server.set("view engine", "ejs")
const port = process.env.PORT
const url = process.env.DB_URL
const table = process.env.TABLE
const dbname = process.env.DB_NAME
// home route
server.get("/", (req, res)=>{
    res.render("dashboard")
})
// register route
server.post("/register", async(req, res)=>{
    const email = req.body.email
    const password = req.body.password
    const hash = await bcrypt.hash(password, 10)
    const obj = {
        email:email,
        hash:hash
    }
    client.connect(url).then((client)=>{
        const db = client.db(dbname)
        db.collection(table).insertOne(obj).then((result)=>{
            res.send({
                message:"inserted successfully",
                result:result
            })
        }).catch(err => console.log(err))
    })
    //  client.db(dbname).then(db => db.collection(table).insertOne(obj)).then((result)=>{
    //     res.send({
    //         message:"inserted successfully",
    //         result:result
    //     })
    // }).catch(err => console.log(err))
})
server.listen(port, (err)=>{
    if(err){
        console.log(err);
    }
    console.log('server is running on port '+ port);
})