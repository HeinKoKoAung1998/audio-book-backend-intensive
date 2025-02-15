const express = require('express');
const router = express.Router();
const controller = require("../controller/user.controller");
const {isAuthenticated,adminAuthorizeRole}= require("../auth/auth")

router.post('/signup', controller.signUp);
router.post('/login',controller.login);
router.get('/get-all',isAuthenticated,adminAuthorizeRole,controller.getAllUserInfo);
router.get('/get-me',isAuthenticated,controller.getOneUserInfo);
router.get('/get/:id',isAuthenticated,adminAuthorizeRole,controller.getOneUserById);
router.post('/change-password',isAuthenticated,controller.changePassword);  
router.patch('/update-role',isAuthenticated,adminAuthorizeRole,controller.updateRole);
router.delete('/delete',isAuthenticated,adminAuthorizeRole,controller.deleteAll);
router.delete('/delete-by-id/:id',isAuthenticated,adminAuthorizeRole,controller.deleteById);
router.post('/forgot-password',controller.forgotPassword);
router.post('/reset-password/:token',controller.resetPassword);
router.get('/reset-password/:token',controller.renderResetPasswordForm)

module.exports = router;