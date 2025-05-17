const express = require("express");
const authController = require("../controllers/authController");
const userAuth = require("../middleware/userAuth");

const authRoutes = express.Router();

authRoutes.get("/data",userAuth, authController.getUsersData);

module.exports = authRoutes;