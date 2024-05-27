const express = require("express")
const cors = require("cors")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const bodyParser = require("body-parser")
const dotenv = require("dotenv")
dotenv.config()
// set up the server
const server = express()

// use the server module
server.use(cors())
server.use(bodyParser.urlencoded({extended:true}))
const checkLogin = function(req, res, next){
    const Bearer_token = req.headers['authorization']
    if(Bearer_token == null && typeof Bearer_token == undefined){
        res.send({
            message: "unauthorize user",
            type: "user authorization error"
        })
    }else{
        Bearer_token_box = Bearer_token.split(" ")
        const token = Bearer_token_box[1]
        req.token = token
        next()
    }

}
server.use(express.json())

server.get("/", (req, res)=>{
    res.write("welcome to the home page")
    res.end()
})
// register route
server.post("/register", async(req, res)=>{
    const {firstname, lastname, username, password} = req.body
    if(firstname.length>0 || lastname.length>0 || username.length>0 || password.length>0){
         // const username = req.body.username
        const profile = {
           firstname:firstname,
           lastname:lastname,
           username:username,
           password:password
        }
       const secret = await bcrypt.hash(password, 20)
       // const verify = await bcrypt.compare("fred", secret)
       jwt.sign(profile, "sigin", (error, token)=>{
          if(error){
            res.status(403).send({
                message:"invalid user registration"
            })
          }
          res.send({
            message: "registered successfully",
            hashkey:secret,
            token:token
           });
       })
    }else{
        res.write("you have not enter anything")
        res.end()
    }
   
})

// login route
server.post("/login", checkLogin, (req, res)=>{
    // const{username, password} = req.body
    // const verify = await bcrypt.compare(password, secret)
    jwt.verify(req.token, "sigin", (error, user_data)=>{
        if(error){
            res.status(403).send({
                message : "not an authorize user"
            })
        }
        res.status(200).send({
            message: "user login successfully",
            data: user_data
        })
    })
    
})

// create a listening port
server.listen(process.env.PORT, function(error){
    if(error){
        console.log("unable to connect");
    }
    console.log("server is listening on port " + process.env.PORT);
})