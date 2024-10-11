var express = require("express");
var router = express.Router();

const tgMiddleware = require("../../Middlewares/auth_required");
var Task = require("../../Controllers/Task");
router.get("/list",  tgMiddleware.auth_required, Task.list);
router.post("/claim", tgMiddleware.auth_required, Task.claim);
router.post("/check", tgMiddleware.auth_required, Task.checkTask);
module.exports = router;