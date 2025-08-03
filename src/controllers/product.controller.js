const BaseController = require('./base.controller');
const productService = require('../services/product.service');
const ResponseUtils = require('../utils/response.utils');

class ProductController extends BaseController {
  constructor() {
    super(productService);
  }

  async updateQuantities(req, res) {
    try {
      const { quantityUpdates } = req.body;

      // Validate request body
      if (!Array.isArray(quantityUpdates) || quantityUpdates.length === 0) {
        return ResponseUtils.validationError(res, 'quantityUpdates must be a non-empty array');
      }

      // Validate each update object
      for (const update of quantityUpdates) {
        if (!update.productId || typeof update.quantity !== 'number') {
          return ResponseUtils.validationError(res, 'Each update must have productId and quantity fields');
        }
      }

      const result = await productService.updateQuantities(quantityUpdates);
      
      ResponseUtils.success(res, result, 'Bulk quantity update completed');
    } catch (error) {
      console.error('Bulk quantity update error:', error);
      ResponseUtils.serverError(res, error.message);
    }
  }
}

module.exports = new ProductController(); 