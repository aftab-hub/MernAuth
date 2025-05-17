const User = require("../models/userSchma")

// get user data from dataBase
const getUsersData = async(req, res)=>{

    try {
        const {userId} = req.body
        const user = await User.findById(userId)
        if (!user) {
            return res.json({success: false, message: "user not found" })
        }
       return res.json({success: true, userData:{
            name : user.name,
            email : user.email,
            isAccountVerified : user.isAccountVerified
        }})
    } catch (err) {
       return res.json({success: false, message : err.message})
    }
}

module.exports = {
    getUsersData
}