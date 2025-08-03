const ResponseUtils = require('../utils/response.utils');

class BaseController {
  constructor(service) {
    this.service = service;
  }

  create = async (req, res) => {
    try {
      const item = await this.service.create(req.body);
      ResponseUtils.success(res, item, "Item created successfully", 201);
    } catch (err) {
      ResponseUtils.error(res, err.message, 400);
    }
  };

  getAll = async (req, res) => {
    try {
      const items = await this.service.findAll();
      ResponseUtils.success(res, items, "Items retrieved successfully");
    } catch (err) {
      ResponseUtils.error(res, err.message, 400);
    }
  };

  getById = async (req, res) => {
    try {
      const item = await this.service.findById(req.params.id);
      if (!item) return ResponseUtils.notFound(res, 'Item not found');
      ResponseUtils.success(res, item, "Item retrieved successfully");
    } catch (err) {
      ResponseUtils.error(res, err.message, 400);
    }
  };

  update = async (req, res) => {
    try {
      const item = await this.service.update(req.params.id, req.body);
      if (!item) return ResponseUtils.notFound(res, 'Item not found');
      ResponseUtils.success(res, item, "Item updated successfully");
    } catch (err) {
      ResponseUtils.error(res, err.message, 400);
    }
  };

  delete = async (req, res) => {
    try {
      const item = await this.service.delete(req.params.id);
      if (!item) return ResponseUtils.notFound(res, 'Item not found');
      ResponseUtils.success(res, { deleted: true }, "Item deleted successfully");
    } catch (err) {
      ResponseUtils.error(res, err.message, 400);
    }
  };
}

module.exports = BaseController; 