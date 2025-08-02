const express = require('express');
const router = express.Router();

router.use('/user', require('./user.route'));
router.use('/product', require('./product.route'));
router.use('/invoice', require('./invoice.route'));

router.get('/', (req, res) => {
  res.send('API is running');
});

module.exports = router; 