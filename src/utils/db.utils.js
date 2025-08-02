const { connectDB } = require('../config/mongo.client');

/**
 * Get the current database connection
 * @returns {Promise<Object>} Database connection object
 */
const getConnection = async () => {
  return await connectDB();
};

/**
 * Check if database is connected
 * @returns {boolean} Connection status
 */
const isConnected = () => {
  return global.dbConnection && global.dbConnection.readyState === 1;
};

/**
 * Get mongoose instance for model operations
 * @returns {Object} Mongoose instance
 */
const getMongoose = () => {
  return require('mongoose');
};

module.exports = {
  getConnection,
  isConnected,
  getMongoose
}; 