var express = require("express");
var router = express.Router();

var authController = require("../../Controllers/Auth");

router.post("/tg", authController.Auth);

module.exports = router;