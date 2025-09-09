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
  "http://localhost:3000",
  "https://mernauth-frontend-mmfw.onrender.com"
];

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps, curl, Postman)
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  credentials: true
}));
app.use(express.json({extended : true, limit : "5mb"}))
app.use(bodyParser.json({extended : true, limit : "5mb"}))
app.use(bodyParser.urlencoded({extended : true}))
app.use(cookieParser())


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
