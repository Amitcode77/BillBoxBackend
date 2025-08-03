const express = require('express');
const router = express.Router();
const ResponseUtils = require('../utils/response.utils');

router.use('/health', require('./health.route'));
router.use('/auth', require('./auth.route'));
router.use('/product', require('./product.route'));
router.use('/user', require('./user.route'));
router.use('/invoice', require('./invoice.route'));

router.get('/', (req, res) => {
  ResponseUtils.success(res, { message: 'API is running' }, 'API is running');
});

module.exports = router; 