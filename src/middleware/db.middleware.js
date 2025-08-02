const { connectDB } = require('../config/mongo.client');

const dbConnectionMiddleware = async (req, res, next) => {
  try {
    // Check and ensure database connection on every request
    const connection = await connectDB();
    
    // Add connection to request object for use in controllers/services
    req.dbConnection = connection;
    
    // Check connection state
    if (connection.readyState !== 1) {
      return res.status(503).json({
        error: 'Database connection not ready',
        message: 'Service temporarily unavailable'
      });
    }
    
    next();
  } catch (error) {
    console.error('Database connection middleware error:', error);
    return res.status(503).json({
      error: 'Database connection failed',
      message: 'Unable to connect to database'
    });
  }
};

module.exports = dbConnectionMiddleware; 