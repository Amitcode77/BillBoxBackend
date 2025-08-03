const ResponseUtils = require('../utils/response.utils');

class HealthController {
  async checkHealth(req, res) {
    try {
      // Check if global connection exists and is ready
      const dbConnected = global.dbConnection && global.dbConnection.readyState === 1;
      
      const healthStatus = {
        status: dbConnected ? 'healthy' : 'unhealthy',
        timestamp: new Date().toISOString(),
        database: {
          status: dbConnected ? 'connected' : 'disconnected',
          readyState: global.dbConnection ? global.dbConnection.readyState : null
        },
        uptime: process.uptime(),
        memory: process.memoryUsage()
      };

      const statusCode = dbConnected ? 200 : 503;
      const message = dbConnected ? 'Health check successful' : 'Health check failed';
      
      if (dbConnected) {
        ResponseUtils.success(res, healthStatus, message, statusCode);
      } else {
        ResponseUtils.error(res, message, statusCode, healthStatus);
      }
    } catch (error) {
      console.error('Health check error:', error);
      const errorData = {
        status: 'unhealthy',
        timestamp: new Date().toISOString(),
        database: {
          status: 'error',
          readyState: null
        }
      };
      ResponseUtils.serverError(res, 'Health check failed', errorData);
    }
  }
}

module.exports = new HealthController(); 