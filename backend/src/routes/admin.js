/**
 * Admin Routes
 * CRMS Backend
 */

const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { auth, rbac } = require('../middleware');

// All routes require admin role
router.use(auth.verifyToken);
router.use(rbac.requireRole('admin'));

// Result publishing
router.post('/publish', adminController.publishResults);
router.post('/rollback/:resultId', adminController.rollbackResult);

// User management
router.get('/users', adminController.getUsers);
router.post('/users', adminController.createUser);
router.put('/users/:userId', adminController.updateUser);
router.delete('/users/:userId', adminController.deleteUser);

// Student management
router.get('/students', adminController.getStudents);
router.post('/students/suspend/:regno', adminController.suspendStudent);
router.post('/students/activate/:regno', adminController.activateStudent);

// Audit logs
router.get('/logs', adminController.getAuditLogs);

// Statistics
router.get('/stats', adminController.getStats);

module.exports = router;
