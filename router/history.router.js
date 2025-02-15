const router = require('express').Router();
const controller = require('../controller/history.controller');
const { isAuthenticated } = require('../auth/auth');

router.post('/add',isAuthenticated, controller.addListeningHistory);
router.get('/get/:id',isAuthenticated, controller.getListeningHistoryById);
router.get('/get-by-user/:id',isAuthenticated,controller.getListeningHistoryByUserId);
router.delete('/delete/:id',isAuthenticated, controller.deleteListeningHistoryById);

module.exports = router;    
