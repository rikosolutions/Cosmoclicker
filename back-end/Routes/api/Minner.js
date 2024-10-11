var express = require("express");
var router = express.Router();

const tgMiddleware = require("../../Middlewares/auth_required");
const Minner = require("../../Controllers/Minner");

router.get("/list", tgMiddleware.auth_required, Minner.getList);
router.post("/upgrade", tgMiddleware.auth_required, Minner.upgrade);
router.post("/claim", tgMiddleware.auth_required, Minner.claim);




module.exports = router;