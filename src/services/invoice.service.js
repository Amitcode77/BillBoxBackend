const BaseService = require('./base.service');
const Invoice = require('../models/invoice.model');
const Product = require('../models/product.model');

class InvoiceService extends BaseService {
  constructor() {
    super(Invoice);
  }

  async create(invoiceData) {
    // Use global database connection
    const session = await global.dbConnection.startSession();
    session.startTransaction();

    try {
      let totalAmount = 0;
      const updatedItems = [];

      // 1. Validate and update stock
      for (const item of invoiceData.items) {
        const product = await Product.findById(item.product).session(session);

        if (!product) {
          throw new Error(`Product not found: ${item.product}`);
        }

        if (product.quantity < item.quantity) {
          throw new Error(`Insufficient stock for product: ${product.name}`);
        }

        // Update stock
        product.quantity -= item.quantity;
        await product.save({ session });

        const total = item.quantity * item.price;
        totalAmount += total;

        // Update item with snapshot data
        updatedItems.push({
          product: product._id,
          name: product.name,
          quantity: item.quantity,
          price: item.price,
          total,
        });
      }

      // 2. Generate invoice number
      const invoiceNumber = this.generateInvoiceNumber();

      // 3. Create invoice
      const invoice = await Invoice.create([{
        invoiceNumber,
        soldBy: invoiceData.soldBy,
        items: updatedItems,
        totalAmount,
        paymentMethod: invoiceData.paymentMethod || 'cash'
      }], { session });

      await session.commitTransaction();
      session.endSession();

      return invoice[0];
    } catch (err) {
      await session.abortTransaction();
      session.endSession();
      throw err;
    }

  }


  generateInvoiceNumber(prefix='INV'){
    const now = new Date();
    
    // Format date as YYYYMMDD
    const datePart = now.toISOString().slice(0, 10).replace(/-/g, '');
    
    // Format time as HHMMSS
    const timePart = now.toTimeString().slice(0, 8).replace(/:/g, '');
    
    // Random 4-digit number
    const randomPart = Math.floor(1000 + Math.random() * 9000);

    return `${prefix}-${datePart}${timePart}-${randomPart}`;
    
  }

}

module.exports = new InvoiceService(); 