const jwt = require("jsonwebtoken")
require("dotenv").config()

const userAuth = async(req, res, next)=>{
    
    // const {token} = req.cookies.token || req.headers.authorization || req.body.token || req.query.token || req.params.token;
    const {token} = req.cookies; // here we are taking out token from req.cookies
    if (!token) {
        return res.json({success : false, message : "not authorized login again"})
    }
    try {
        // verify method is used to verify or decode the jwt token it checks if : 
        // 1. the token was sign with correct secret key
        // 2. the token is not expired
     const tokenDecode = jwt.verify(token,process.env.SECRET_KEY)

     /* Note --->  If there's already data in req.body, keep it. If not, assign an empty object to it, so the code doesn't break when trying to access properties.
     used when to avoid runtime errors when accessing properties from req.body — especially when no data is sent in the request */
 
     req.body = req.body || {}; // It prevents errors --> (Cannot read property 'username' of undefined)
     
    if (tokenDecode.id) {
        req.body.userId = tokenDecode.id
    }else{
        return res.json({success : false, message : "not authorized login again"})
    }

    // to execute the function we use next(parameter)
    
     next()

    } catch (err) {
        return res.json({success : false, message: err.message})
    }
} 

module.exports = userAuth;