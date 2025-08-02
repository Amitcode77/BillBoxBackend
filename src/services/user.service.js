const BaseService = require('./base.service');
const User = require('../models/user.model');

class UserService extends BaseService {
  constructor() {
    super(User);
  }
}

module.exports = new UserService(); 