const authService = require('../services/auth.service');
const ResponseUtils = require('../utils/response.utils');

class AuthController {
  /**
   * Login user with email and password
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async login(req, res) {
    try {
      const { email, password } = req.body;

      // Validate required fields
      if (!email || !password) {
        return ResponseUtils.validationError(res, 'Email and password are required');
      }

      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return ResponseUtils.validationError(res, 'Please provide a valid email address');
      }

      // Attempt login
      const result = await authService.login(email, password);
      
      ResponseUtils.success(res, result, 'Login successful');
    } catch (error) {
      console.error('Login error:', error);
      
      if (error.message === 'Invalid email or password') {
        ResponseUtils.error(res, error.message, 401);
      } else {
        ResponseUtils.serverError(res, 'Login failed');
      }
    }
  }

  /**
   * Logout user
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async logout(req, res) {
    try {
      const token = req.headers.authorization?.replace('Bearer ', '');
      
      // Token is only required if JWT is enabled
      if (authService.useJWT && !token) {
        return ResponseUtils.validationError(res, 'Token is required');
      }

      await authService.logout(token);
      
      ResponseUtils.success(res, { loggedOut: true }, 'Logout successful');
    } catch (error) {
      console.error('Logout error:', error);
      ResponseUtils.serverError(res, 'Logout failed');
    }
  }

  /**
   * Get current user profile
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async getCurrentUser(req, res) {
    try {
      const token = req.headers.authorization?.replace('Bearer ', '');
      const { email } = req.body; // For non-JWT mode
      
      let user;
      
      if (authService.useJWT) {
        if (!token) {
          return ResponseUtils.validationError(res, 'Token is required');
        }
        user = await authService.getCurrentUser(token);
      } else {
        if (!email) {
          return ResponseUtils.validationError(res, 'Email is required');
        }
        user = await authService.getCurrentUser(null, email);
      }
      
      ResponseUtils.success(res, user, 'User profile retrieved successfully');
    } catch (error) {
      console.error('Get current user error:', error);
      
      if (error.message === 'Invalid or expired token') {
        ResponseUtils.error(res, error.message, 401);
      } else if (error.message === 'User not found') {
        ResponseUtils.notFound(res, error.message);
      } else {
        ResponseUtils.serverError(res, 'Failed to get user profile');
      }
    }
  }
}

module.exports = new AuthController(); 