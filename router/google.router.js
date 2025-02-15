const router = require('express').Router();
const controller = require('../controller/google.controller');


router.post('/google',controller.googleSignIn);

module.exports = router;