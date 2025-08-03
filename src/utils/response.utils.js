/**
 * Response utility for standardizing API responses
 */

class ResponseUtils {
  /**
   * Send a successful response
   * @param {Object} res - Express response object
   * @param {number} statusCode - HTTP status code (default: 200)
   * @param {any} data - Response data
   * @param {string} message - Success message (default: "success")
   */
  static success(res, data = null, message = "success", statusCode = 200) {
    return res.status(statusCode).json({
      success: true,
      message,
      data
    });
  }

  /**
   * Send an error response
   * @param {Object} res - Express response object
   * @param {number} statusCode - HTTP status code (default: 400)
   * @param {string} message - Error message (default: "failed")
   * @param {any} data - Additional error data (optional)
   */
  static error(res, message = "failed", statusCode = 400, data = null) {
    return res.status(statusCode).json({
      success: false,
      message,
      data
    });
  }

  /**
   * Send a not found response
   * @param {Object} res - Express response object
   * @param {string} message - Not found message (default: "Resource not found")
   */
  static notFound(res, message = "Resource not found") {
    return this.error(res, message, 404);
  }

  /**
   * Send a validation error response
   * @param {Object} res - Express response object
   * @param {string} message - Validation error message
   * @param {any} data - Validation details
   */
  static validationError(res, message = "Validation failed", data = null) {
    return this.error(res, message, 400, data);
  }

  /**
   * Send a server error response
   * @param {Object} res - Express response object
   * @param {string} message - Server error message (default: "Internal server error")
   */
  static serverError(res, message = "Internal server error") {
    return this.error(res, message, 500);
  }
}

module.exports = ResponseUtils; 