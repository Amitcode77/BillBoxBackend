const BaseService = require('./base.service');
const User = require('../models/user.model');

class UserService extends BaseService {
  constructor() {
    super(User);
  }

  /**
   * Create a new user with password hashing
   * @param {Object} userData - User data including password
   * @returns {Object} Created user
   */
  async create(userData) {
    try {
      // Create user instance to trigger password hashing
      const user = new User(userData);
      await user.save();
      
      // Return user without password hash
      const userDoc = user.toObject();
      delete userDoc.passwordHash;
      
      return userDoc;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Find user by email
   * @param {String} email - User email
   * @returns {Object} User object
   */
  async findByEmail(email) {
    try {
      return await User.findOne({ email }).select('-passwordHash');
    } catch (error) {
      throw error;
    }
  }
}

module.exports = new UserService(); 