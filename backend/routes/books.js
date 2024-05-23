const express = require('express');
const router = express.Router();

const auth = require('../middleware/auth');
const multer = require('../middleware/upload');

const booksCtrl = require('../controllers/books');

// Logique des routes books
router.get('/', booksCtrl.getAllBooks);
router.post('/', auth, multer, booksCtrl.createBook);
router.get('/:id', auth, booksCtrl.getOneBook);
router.put('/:id', auth, multer, booksCtrl.modifyBook);
router.delete('/:id', auth, booksCtrl.deleteBook);

module.exports = router;