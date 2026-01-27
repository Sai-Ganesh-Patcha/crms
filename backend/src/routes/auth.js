/**
 * Auth Routes
 * CRMS Backend
 */

const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { auth } = require('../middleware');
const { validate, authRules } = require('../middleware/validate');

// Public routes
router.post('/login', authRules.login, validate, authController.login);
router.post('/refresh', authController.refreshToken);

// Protected routes
router.post('/logout', auth.verifyToken, authController.logout);
router.post('/change-password', auth.verifyToken, authRules.changePassword, validate, authController.changePassword);
router.get('/me', auth.verifyToken, authController.getMe);

module.exports = router;
