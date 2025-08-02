const express = require('express');
const router = express.Router();
const invoiceController = require('../controllers/invoice.controller');

router.post('/', invoiceController.create);
router.get('/', invoiceController.getAll);
router.get('/:id', invoiceController.getById);
router.patch('/:id', invoiceController.update);
router.delete('/:id', invoiceController.delete);

module.exports = router; 