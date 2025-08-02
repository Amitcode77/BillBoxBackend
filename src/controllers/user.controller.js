const BaseController = require('./base.controller');
const userService = require('../services/user.service');

class ProductController extends BaseController {
  constructor() {
    super(userService);
  }
}

module.exports = new ProductController(); 