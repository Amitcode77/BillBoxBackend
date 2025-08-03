const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');

// Login endpoint
router.post('/login', authController.login);

// Logout endpoint
router.post('/logout', authController.logout);

// Get current user profile
router.get('/me', authController.getCurrentUser);

module.exports = router; 