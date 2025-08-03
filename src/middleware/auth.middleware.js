const authService = require('../services/auth.service');
const ResponseUtils = require('../utils/response.utils');

/**
 * Middleware to authenticate user (JWT token or email/password)
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next function
 */
const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN
    const { email, password } = req.body; // For non-JWT mode

    let user;
    let decoded;

    if (authService.useJWT) {
      // JWT mode
      if (!token) {
        return ResponseUtils.error(res, 'Access token required', 401);
      }

      // Verify token and get user data
      decoded = authService.verifyToken(token);
      user = await authService.getCurrentUser(token);
    } else {
      // Non-JWT mode - authenticate with email and password
      if (!email || !password) {
        return ResponseUtils.error(res, 'Email and password required', 401);
      }

      // Authenticate user
      const authResult = await authService.login(email, password);
      user = authResult.user;
      decoded = { userId: user._id, email: user.email, role: user.role };
    }

    // Add user data to request object
    req.user = user;
    req.token = decoded;

    next();
  } catch (error) {
    console.error('Authentication error:', error);
    
    if (error.message === 'Invalid or expired token') {
      return ResponseUtils.error(res, 'Invalid or expired token', 401);
    } else if (error.message === 'User not found') {
      return ResponseUtils.error(res, 'User not found', 401);
    } else if (error.message === 'Invalid email or password') {
      return ResponseUtils.error(res, 'Invalid email or password', 401);
    } else {
      return ResponseUtils.error(res, 'Authentication failed', 401);
    }
  }
};

/**
 * Middleware to check if user has required role
 * @param {String|Array} roles - Required role(s)
 * @returns {Function} Express middleware function
 */
const requireRole = (roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return ResponseUtils.error(res, 'Authentication required', 401);
    }

    const userRole = req.user.role;
    const requiredRoles = Array.isArray(roles) ? roles : [roles];

    if (!requiredRoles.includes(userRole)) {
      return ResponseUtils.error(res, 'Insufficient permissions', 403);
    }

    next();
  };
};

/**
 * Middleware to check if user has required permission
 * @param {String|Array} permissions - Required permission(s)
 * @returns {Function} Express middleware function
 */
const requirePermission = (permissions) => {
  return (req, res, next) => {
    if (!req.user) {
      return ResponseUtils.error(res, 'Authentication required', 401);
    }

    const userPermissions = req.user.permissions || [];
    const requiredPerms = Array.isArray(permissions) ? permissions : [permissions];

    const hasPermission = requiredPerms.some(permission => 
      userPermissions.includes(permission)
    );

    if (!hasPermission) {
      return ResponseUtils.error(res, 'Insufficient permissions', 403);
    }

    next();
  };
};

module.exports = {
  authenticateToken,
  requireRole,
  requirePermission
}; 