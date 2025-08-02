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
      
      res.status(statusCode).json(healthStatus);
    } catch (error) {
      console.error('Health check error:', error);
      res.status(503).json({
        status: 'unhealthy',
        timestamp: new Date().toISOString(),
        error: 'Health check failed',
        database: {
          status: 'error',
          readyState: null
        }
      });
    }
  }
}

module.exports = new HealthController(); 