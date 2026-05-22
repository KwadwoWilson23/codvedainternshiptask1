const express = require('express');
const router = express.Router();
const { list, getOne, create, update, remove } = require('../controllers/productController');
const authenticate = require('../middleware/auth');

router.use(authenticate);

router.get('/', list);
router.get('/:id', getOne);
router.post('/', create);
router.put('/:id', update);
router.delete('/:id', remove);

module.exports = router;
