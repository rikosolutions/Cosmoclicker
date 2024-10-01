var express = require("express");
var router = express.Router();

const tgMiddleware = require("../../Middlewares/auth_required");
var earn = require("../../Controllers/Earn");

router.post("/upscore", tgMiddleware.auth_required, earn.upscore);

module.exports = router;