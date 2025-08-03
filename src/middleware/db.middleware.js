const { connectDB } = require('../config/mongo.client');
const ResponseUtils = require('../utils/response.utils');

const dbConnectionMiddleware = async (req, res, next) => {
  try {
    // Check and ensure database connection on every request
    const connection = await connectDB();
    
    // Add connection to request object for use in controllers/services
    req.dbConnection = connection;
    
    // Check connection state
    if (connection.readyState !== 1) {
      return ResponseUtils.error(res, 'Service temporarily unavailable', 503, { error: 'Database connection not ready' });
    }
    
    next();
  } catch (error) {
    console.error('Database connection middleware error:', error);
    return ResponseUtils.error(res, 'Unable to connect to database', 503, { error: 'Database connection failed' });
  }
};

module.exports = dbConnectionMiddleware; 