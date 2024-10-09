var express = require("express");
var router = express.Router();

const earnRouter = require("./Earn");
const authRouter = require("./Auth");
const referralRouter = require("./Referral");
const taskROuter = require("./Task");
const minnerROuter = require("./Minner");



router.use("/auth", authRouter);
router.use("/earn", earnRouter);
router.use("/referral", referralRouter);
router.use("/task",taskROuter)
router.use("/minner",minnerROuter)



module.exports = router;