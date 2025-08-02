const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

// Global connection object
global.dbConnection = null;

const connectDB = async () => {
  try {
    // Check if already connected
    if (global.dbConnection && global.dbConnection.readyState === 1) {
      console.log('MongoDB already connected');
      return global.dbConnection;
    }

    const connection = await mongoose.connect(process.env.MONGODB_URI);
    global.dbConnection = connection.connection;
    console.log('MongoDB connected');
    return global.dbConnection;
  } catch (err) {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  }
};


module.exports = { connectDB, getDBConnection, mongoose }; 