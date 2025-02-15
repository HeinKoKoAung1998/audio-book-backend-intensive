const router = require('express').Router();
const controller = require('../controller/favorite.controller');
const { isAuthenticated } = require('../auth/auth');

router.post('/add',isAuthenticated, controller.addFavorite);
router.get('/get-all',isAuthenticated, controller.getAllFavorites);
router.get('/get-by-user/:id',isAuthenticated,controller.getAllFavoriteByUserId);
router.delete('/delete',isAuthenticated, controller.deleteFavoriteById);
router.delete('/delete-all', isAuthenticated, controller.deleteAllFavorites);

module.exports = router;