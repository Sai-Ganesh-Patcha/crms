/**
 * Routes Index
 * CRMS Backend
 */

const express = require('express');
const router = express.Router();

// Mount routes
router.use('/auth', require('./auth'));
router.use('/students', require('./student'));
router.use('/marks', require('./marks'));
router.use('/admin', require('./admin'));
router.use('/operator', require('./operator'));

// Health check
router.get('/health', (req, res) => {
    res.json({
        success: true,
        message: 'CRMS API is running',
        timestamp: new Date().toISOString()
    });
});

module.exports = router;
