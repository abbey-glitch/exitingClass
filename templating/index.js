const express = require("express")
const server = express()
const path = require("path")
const cookieParser = require("cookie-parser")
const bodyParser = require("body-parser")
const dotenv = require("dotenv")
dotenv.config()
const cors = require("cors")

// set up the install module
server.use(cors())
server.use(bodyParser.urlencoded({extended:false}))
server.use(express.static(path.join(__dirname, "public")))
// set template engine
server.set("view engine", "ejs")
server.use("/", (req, res, next)=>{
    if(req.method == "GET"){
        res.render("index")
    }
})
// set listen port
const connect = process.env.PORT
server.listen(connect, (error)=>{
    if(error){
        console.log("server error");
    }
    console.log(`server is listening on: ${connect}`);
})
