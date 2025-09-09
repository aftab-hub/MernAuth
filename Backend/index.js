const express = require("express")
const mongoose = require("mongoose")
require("dotenv").config()
const cors = require("cors")
const bodyParser = require("body-parser")
const userRoutes = require("./routes/userRoutes")
const authRoutes = require("./routes/authRoutes")


// here cookieParser is used for send otp 
const cookieParser = require("cookie-parser")
const app = express()

const allowedOrigins = [
    "https://mernauth-frontend-mmfw.onrender.com" // frontend url
]


app.use(express.json({extended : true, limit : "5mb"}))
app.use(bodyParser.json({extended : true, limit : "5mb"}))
app.use(bodyParser.urlencoded({extended : true}))
app.use(cookieParser())

// assign the allowed origins to the cors
app.use(cors({credentials: true, origin : allowedOrigins}))


mongoose.connect(process.env.DB_URL)
.then(()=>{
app.listen(process.env.Port,()=>{
    console.log(`Server is up and running on port ${process.env.Port}`);
    console.log("Connected to DataBase");
})
})
.catch((err)=>{
    console.log(err);
})

app.use("/api/user", userRoutes)
app.use("/api/auth", authRoutes)

app.use("/", (req, res)=>{
    res.send(`Welcome to the server`)
})
