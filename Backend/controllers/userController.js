const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
require("dotenv").config()
const transporter = require("../config/nodemailer")
const User = require('../models/userSchma')
const {EMAIL_VERIFY_TEMPLATE, PASSWORD_RESET_TEMPLATE} = require('../config/emailTemplate')

//create / register user / sign up
const register = async(req, res)=>{

    const {name, email, password} = req.body
    
    if (!name || !email || !password) {
        return res.json({
            success : false,
            message : "Missing Details"
        })
    }

    try {
         const existingUser = await User.findOne({email})

         if (existingUser) {
            return res.json({success : false, message : "user already exists"})
         }

        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, salt)
        const user = new User({name, email, password : hashedPassword})
        await user.save()
        
        // here we are sending a cookie in the form of token of (user._id) using secret key that will be saved and used it while we login 
        const token = jwt.sign({id : user._id}, process.env.SECRET_KEY,{expiresIn : "7d"})  // we use sign method to create or generate a token sign mehtod is provided by the jsonwebtoken library
        res.cookie("token", token ,{
            httpOnly : true,
            secure : process.env.NODE_ENV === "production",
            sameSite : process.env.NODE_ENV === 'production' ? "none" : "strict",
            maxAge : 7 * 24 * 60 * 60 * 1000,
        })
         const mailOptions = {
            from : process.env.SENDER_EMAIL,
            to : email,
            subject : "Welcome to greatStack",
            text : `Welcome to greatStack website. Your account has been created with email id : ${email}`
         }

         await transporter.sendMail(mailOptions)

        return res.json({success : true})

    } catch (err) {
       return res.json({success : false, message : err.message})
    }
}


// login user
const login = async(req, res)=>{
    const {email, password} = req.body

    if (!email || !password) {
        return res.json({success : false, message : "Email and Password are required"})
    }
  
    try {
        const user = await User.findOne({email})
        if (!user) {
           return res.json({success : false, message : "Invalid Email"}) 
        }
    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) {
        return res.json({success : false, message : "Invalid password"}) 
    }
    const token = jwt.sign({id : user._id}, process.env.SECRET_KEY,{expiresIn : "7d"})
    res.cookie("token", token ,{
        httpOnly : true,
        secure : process.env.NODE_ENV === "production",
        sameSite : process.env.NODE_ENV === 'production' ? "none" : "strict",
        maxAge : 7 * 24 * 60 * 60 * 1000,
    })

    return res.json({success : true, message : "Login Success"})

    } catch (err) {
      return  res.json({success : false, message : err.message})
    }
}

// logout user
const logOut = async (req, res)=>{
try {
    // when we logout from any app or website we clear that cookie used while login
   res.clearCookie("token", { 
    httpOnly : true,
    secure : process.env.NODE_ENV === "production",
    sameSite : process.env.NODE_ENV === 'production' ? "none" : "strict",
   }) 
   return res.json({success : true, message : "loged Out"})
} catch (err) {
    return  res.json({success : false, message : err.message})
}
}

// send opt to resgistered email
const sendVerifyOtp = async (req, res)=>{
   try {
    const {userId} = req.body
    const user = await User.findById(userId)
    if (user.isAccountVerified) {
        return res.json({success : false, message : "Account already verified"})
    }

    const otp = String(Math.floor(100000 + Math.random() * 900000))
    user.verifyOtp = otp
    user.verifyOtpExpireAt = Date.now() + 24 * 60 * 60 * 1000
    await user.save()

    const mailOption = {
    from : process.env.SENDER_EMAIL,
    to : user.email,
    subject : "Account Verification otp",
    // text : `Your OTP is ${otp}. Verify your accout using this OTP.`, 
    html : EMAIL_VERIFY_TEMPLATE.replace("{{otp}}", otp).replace("{{email}}", user.email)
   }
   await transporter.sendMail(mailOption)

    res.json({success : true, message: "Verification OTP Sent on Email"})

   } catch (err) {
    return res.json({success : false, message : err.message})
   }
}

// check if otp is varified sent by and resgistered email
const verifyEmail = async(req, res) =>{
    const {userId, otp} = req.body

    if (!userId || !otp) {
        return res.json({success : false, message: "missing details"})
    }

    try {
        const user = await User.findById(userId)
        if (!user) {
            return res.json({success : false, message: "user not found"})
        }

        if (user.verifyOtp === '' || user.verifyOtp !== otp) {
            return res.json({success : false, message : "invalid otp"})
        }

        if (user.verifyOtpExpireAt < Date.now()) {
            return res.json({success : false, message : "opt expired"})
        }
         
        user.isAccountVerified = true,
        user.verifyOtp = '',
        user.verifyOtpExpireAt = 0,
        await user.save()
        return res.json({success : true, message : "email verified successufully"})
    } catch (err) {
       return res.json({success: false, message: err.message}) 
    }
}

// check if user is authenticated
const isAuthenticated = async(req, res)=>{
try {
   return res.json({success: true,}) 
} catch (err) {
    res.json({success: false, message: err.message})
}
}


// rest otp
const sendResetOtp = async(req, res)=>{
 const {email} = req.body
  if (!email) {
     return res.json({success: false, message : "Email is required"})
  }

  try {
    const user = await User.findOne({email})

    if (!user) {
        return res.json({success: false, message : "user not found"})
    }
    // to generate otp
    const otp = String(Math.floor(100000 + Math.random() * 900000))
    user.resetOtp = otp
    user.resetOtpExpireAt = Date.now() + 15 * 60 * 1000
    await user.save()

    const mailOption = {
    from : process.env.SENDER_EMAIL,
    to : user.email,
    subject : "Password Reset otp",
    // text : `Your OTP for reseting your password is ${otp} Use this OTP to proceed with reseting your password.`,
    html : PASSWORD_RESET_TEMPLATE.replace("{{otp}}", otp).replace("{{email}}", user.email)
   }
   await transporter.sendMail(mailOption)
  return res.json({success: true, message : "OTP sent to your Email"})

  } catch (err) {
    return res.json({success: false, message: err.message})
  }
}

// verify otp and reset the password
const resetPassword = async(req, res)=>{
    const {email, otp, newPassword} = req.body
    if (!email || !otp || !newPassword) {
        return res.json({success: false, message: "Email, otp, newPassword are required"})
    }

    try {
        const user = await User.findOne({email})
        if (!user) {
            return res.json({success : false, message : "user not found"})
        }

        if (user.resetOtp === '' || user.resetOtp !== otp) {
            return res.json({success : false, message : "Invalid Otp"})
        }

        if (user.resetOtpExpireAt < Date.now()) {
            return res.json({success : false, message : "Otp is expired"})
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10)
        user.password = hashedPassword
        user.resetOtp = ''
        user.resetOtpExpireAt = 0;

        await user.save()
        return res.json({success: true, message : "Password has been reset successfully "})

    } catch (err) {
        return res.json({success: false, message : err.message})
    }
}



module.exports = {
    register,
    login,
    logOut,
    sendVerifyOtp,
    verifyEmail,
    isAuthenticated,
    sendResetOtp,  
    resetPassword,
   
}