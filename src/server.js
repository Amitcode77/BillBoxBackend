const express = require('express');
const dotenv = require('dotenv');
const { connectDB } = require('./config/mongo.client');
const dbConnectionMiddleware = require('./middleware/db.middleware');
const ResponseUtils = require('./utils/response.utils');

// Load env vars
dotenv.config();

// Connect to database on startup
connectDB();

const app = express();

// Middleware
app.use(express.json());

// Health endpoint - outside API versioning and before DB middleware
app.use('/health', require('./routes/health.route'));

// Database connection middleware - runs on every request
app.use(dbConnectionMiddleware);

// Routes
app.use('/api/v1', require('./routes/index.route'));

// 404 handler
// app.use('/*', (req, res) => {
//   ResponseUtils.notFound(res, 'Route not found');
// });

// Global error handler
app.use((err, req, res, next) => {
  console.error('Global error handler:', err);
  ResponseUtils.serverError(res, err.message || 'Internal server error');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
