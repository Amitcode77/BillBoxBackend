const jwt = require('jsonwebtoken');
const User = require('../models/user.model');

class AuthService {
  constructor() {
    this.secretKey = process.env.JWT_SECRET || 'your-secret-key-change-in-production';
    this.tokenExpiry = process.env.JWT_EXPIRY || '24h';
    this.useJWT = process.env.USE_JWT !== 'false'; // Default to true unless explicitly set to false
  }

  /**
   * Generate JWT token for user
   * @param {Object} user - User object
   * @returns {String} JWT token
   */
  generateToken(user) {
    const payload = {
      userId: user._id,
      email: user.email,
      role: user.role,
      permissions: user.permissions || []
    };

    return jwt.sign(payload, this.secretKey, { expiresIn: this.tokenExpiry });
  }

  /**
   * Verify JWT token
   * @param {String} token - JWT token
   * @returns {Object} Decoded token payload
   */
  verifyToken(token) {
    try {
      return jwt.verify(token, this.secretKey);
    } catch (error) {
      throw new Error('Invalid or expired token');
    }
  }

  /**
   * Login user with email and password
   * @param {String} email - User email
   * @param {String} password - User password
   * @returns {Object} User data and token (if JWT is enabled)
   */
  async login(email, password) {
    try {
      // Find user by email
      const user = await User.findOne({ email });
      if (!user) {
        throw new Error('Invalid email or password');
      }

      // Verify password
      const isValidPassword = await user.isValidPassword(password);
      if (!isValidPassword) {
        throw new Error('Invalid email or password');
      }

      // Return user data (excluding password)
      const userData = {
        _id: user._id,
        email: user.email,
        fullName: user.fullName,
        phone: user.phone,
        role: user.role,
        permissions: user.permissions,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt
      };

      // Generate token only if JWT is enabled
      if (this.useJWT) {
        const token = this.generateToken(user);
        return {
          user: userData,
          token
        };
      } else {
        return {
          user: userData,
          authenticated: true
        };
      }
    } catch (error) {
      throw error;
    }
  }

  /**
   * Logout user (invalidate token if JWT is enabled)
   * @param {String} token - JWT token to invalidate (optional if JWT is disabled)
   * @returns {Boolean} Success status
   */
  async logout(token) {
    try {
      if (this.useJWT) {
        // In a more advanced implementation, you might want to:
        // 1. Add the token to a blacklist in Redis
        // 2. Store logout timestamp in user document
        // 3. Implement token refresh mechanism
        
        // For now, we'll just return success
        // The client should remove the token from storage
        return true;
      } else {
        // When JWT is disabled, just return success
        return true;
      }
    } catch (error) {
      throw error;
    }
  }

  /**
   * Get current user from token (if JWT is enabled) or by email (if JWT is disabled)
   * @param {String} token - JWT token (required if JWT is enabled)
   * @param {String} email - User email (required if JWT is disabled)
   * @returns {Object} User data
   */
  async getCurrentUser(token, email = null) {
    try {
      if (this.useJWT) {
        const decoded = this.verifyToken(token);
        const user = await User.findById(decoded.userId).select('-passwordHash');
        
        if (!user) {
          throw new Error('User not found');
        }

        return user;
      } else {
        // When JWT is disabled, find user by email
        if (!email) {
          throw new Error('Email is required when JWT is disabled');
        }
        
        const user = await User.findOne({ email }).select('-passwordHash');
        
        if (!user) {
          throw new Error('User not found');
        }

        return user;
      }
    } catch (error) {
      throw error;
    }
  }
}

module.exports = new AuthService(); 