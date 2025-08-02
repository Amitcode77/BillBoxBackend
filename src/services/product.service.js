const BaseService = require('./base.service');
const Product = require('../models/product.model');

class ProductService extends BaseService {
  constructor() {
    super(Product);
  }

  async updateQuantities(quantityUpdates) {
    const session = await global.dbConnection.startSession();
    session.startTransaction();

    try {
      const results = [];
      const errors = [];

      for (const update of quantityUpdates) {
        try {
          const { productId, quantity } = update;
          
          // Validate quantity
          if (typeof quantity !== 'number' || quantity < 0) {
            errors.push({
              productId,
              error: 'Invalid quantity. Must be a non-negative number.'
            });
            continue;
          }

          // Update product quantity
          const product = await Product.findByIdAndUpdate(
            productId,
            { quantity },
            { session }
          );

          if (!product) {
            errors.push({
              productId,
              error: 'Product not found'
            });
          } else {
            results.push({
              productId,
              name: product.name,
              oldQuantity: product.quantity,
              newQuantity: quantity,
              success: true
            });
          }
        } catch (error) {
          errors.push({
            productId: update.productId,
            error: error.message
          });
        }
      }

      await session.commitTransaction();
      session.endSession();

      return {
        success: results.length > 0,
        updated: results,
        errors: errors,
        summary: {
          total: quantityUpdates.length,
          successful: results.length,
          failed: errors.length
        }
      };
    } catch (error) {
      await session.abortTransaction();
      session.endSession();
      throw error;
    }
  }
}

module.exports = new ProductService(); 