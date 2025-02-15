const express = require('express');
const router = express.Router();
const controller = require("../controller/user.activity.controller");
const {isAuthenticated,adminAuthorizeRole}= require("../auth/auth");

router.post('/update',isAuthenticated,controller.addUserActivity);
router.get('/get-all',isAuthenticated,adminAuthorizeRole,controller.getActiveUsers);

module.exports = router;