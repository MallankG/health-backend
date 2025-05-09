// auth.js - Authentication routes
const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// Register route
router.post('/register', authController.register);

// Login route
router.post('/login', authController.login);

// Forgot password
router.post('/forgot-password', authController.forgotPassword);

// Reset password
router.post('/reset-password', authController.resetPassword);

// Direct password reset (no token, just email and new password)
router.post('/reset-password-direct', authController.resetPasswordDirect);

module.exports = router;
