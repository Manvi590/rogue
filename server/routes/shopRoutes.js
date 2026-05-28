const express = require('express');
const router = express.Router();
const { getProducts, getProductById, checkout } = require('../controllers/shopController');

router.get('/', getProducts);
router.get('/:id', getProductById);
router.post('/checkout', checkout);

module.exports = router;

