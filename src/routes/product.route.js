const express = require('express');
const router = express.Router();
const productController = require('../controllers/product.controller');

router.post('/', productController.create);
router.get('/', productController.getAll);
router.get('/:id', productController.getById);
router.patch('/:id', productController.update);
router.delete('/:id', productController.delete);

// Bulk quantity update endpoint
router.post('/stock_update', productController.updateQuantities);

module.exports = router; 