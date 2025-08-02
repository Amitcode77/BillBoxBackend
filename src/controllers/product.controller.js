const BaseController = require('./base.controller');
const productService = require('../services/product.service');

class ProductController extends BaseController {
  constructor() {
    super(productService);
  }

  async updateQuantities(req, res) {
    try {
      const { quantityUpdates } = req.body;

      // Validate request body
      if (!Array.isArray(quantityUpdates) || quantityUpdates.length === 0) {
        return res.status(400).json({
          error: 'Invalid request',
          message: 'quantityUpdates must be a non-empty array'
        });
      }

      // Validate each update object
      for (const update of quantityUpdates) {
        if (!update.productId || typeof update.quantity !== 'number') {
          return res.status(400).json({
            error: 'Invalid update format',
            message: 'Each update must have productId and quantity fields'
          });
        }
      }

      const result = await productService.updateQuantities(quantityUpdates);
      
      res.status(200).json({
        message: 'Bulk quantity update completed',
        ...result
      });
    } catch (error) {
      console.error('Bulk quantity update error:', error);
      res.status(500).json({
        error: 'Internal server error',
        message: error.message
      });
    }
  }
}

module.exports = new ProductController(); 