var express = require("express");
var router = express.Router();

const tgMiddleware = require("../../Middlewares/auth_required");
var Referral = require("../../Controllers/Referral");

router.get("/list", tgMiddleware.auth_required, Referral.list);
router.post("/claim", tgMiddleware.auth_required, Referral.claim);
router.post("/claimall", tgMiddleware.auth_required, Referral.claimAll);


module.exports = router;