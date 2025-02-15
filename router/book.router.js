const router = require('express').Router();
const controller = require('../controller/book.controller');
const { isAuthenticated,adminAuthorizeRole} = require('../auth/auth')

router.post('/add',isAuthenticated,adminAuthorizeRole, controller.addBook);
router.get('/get-all',isAuthenticated, controller.getAllBooks);
router.put('/update/:id',isAuthenticated,adminAuthorizeRole, controller.updateBooksById);
router.get('/get/:id', isAuthenticated,controller.getBookById);
router.delete('/delete/:id',isAuthenticated,adminAuthorizeRole, controller.deleteBookById);

module.exports = router;