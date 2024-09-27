var express = require("express");
var router = express.Router();

var authController = require("../../Controllers/Auth");

router.post("/", authController.Auth);

module.exports = router;