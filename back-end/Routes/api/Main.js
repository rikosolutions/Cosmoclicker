var express = require("express");
var router = express.Router();

var earnRouter = require("./Earn");
var authRouter = require("./Auth");

router.use("/auth", authRouter);
router.use("/earn", earnRouter);

module.exports = router;