const router = require('express').Router();
const { isAuthenticated, adminAuthorizeRole } = require('../auth/auth');
const controller = require('../controller/audio.controller');

router.post('/add',isAuthenticated,adminAuthorizeRole, controller.addAudioFile);
router.get('/get-all',isAuthenticated, controller.getAllAudioFiles);
router.put('/update/:id',isAuthenticated,adminAuthorizeRole, controller.updateAudioFileById);
router.get('/get/:id',isAuthenticated, controller.getAudioFileById);
router.get('/get-by-book/:id',isAuthenticated,controller.getAudioFileByBookId);
router.delete('/delete/:id',isAuthenticated,adminAuthorizeRole, controller.deleteAudioFileById);

module.exports = router;