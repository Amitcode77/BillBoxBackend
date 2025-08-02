const BaseController = require('./base.controller');
const invoiceService = require('../services/invoice.service');

class ProductController extends BaseController {
  constructor() {
    super(invoiceService);
  }
  
}

module.exports = new ProductController(); 