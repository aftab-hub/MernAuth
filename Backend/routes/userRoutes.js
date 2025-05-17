const express = require("express")
const userControllers = require("../controllers/userController")
const authController = require("../controllers/authController")
const userAuth = require("../middleware/userAuth")

const router = express.Router()

router.post("/register", userControllers.register)
router.post("/login", userControllers.login)
router.post("/logout", userControllers.logOut)
router.post("/sendVerifyOtp", userAuth, userControllers.sendVerifyOtp)
router.post("/verifyEmail", userAuth, userControllers.verifyEmail)
router.get("/isAuth", userAuth, userControllers.isAuthenticated)
router.post("/sendResetOpt",  userControllers.sendResetOtp)
router.post("/resetPassword",  userControllers.resetPassword)


module.exports = router;