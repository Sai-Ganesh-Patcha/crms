/**
 * Operator Middleware
 * CRMS Backend
 * 
 * Special middleware for Academic Operator role with re-authentication
 */

const jwt = require('jsonwebtoken');
const config = require('../config/constants');
const { User, AuditLog } = require('../models');

/**
 * Require operator role
 */
const requireOperator = (req, res, next) => {
    if (!req.user) {
        return res.status(401).json({ success: false, message: 'Authentication required' });
    }

    if (req.user.role !== 'operator' && req.user.role !== 'admin') {
        return res.status(403).json({
            success: false,
            message: 'Academic Operator access required'
        });
    }

    next();
};

/**
 * Re-authentication for high-risk operations
 * Requires password in request body to confirm identity
 */
const requireReAuth = async (req, res, next) => {
    try {
        const { reAuthPassword } = req.body;

        if (!reAuthPassword) {
            return res.status(400).json({
                success: false,
                message: 'Re-authentication required for this operation',
                code: 'REAUTH_REQUIRED'
            });
        }

        const user = await User.findById(req.user.id).select('+password');

        if (!user) {
            return res.status(401).json({ success: false, message: 'User not found' });
        }

        const isValid = await user.comparePassword(reAuthPassword);

        if (!isValid) {
            await AuditLog.log({
                action: 'ACCESS_DENIED',
                actorId: req.user.id,
                actorModel: 'User',
                actorName: req.user.name,
                actorRole: req.user.role,
                details: 'Re-authentication failed for high-risk operation',
                ip: req.ip,
                severity: 'WARNING'
            });

            return res.status(401).json({
                success: false,
                message: 'Re-authentication failed. Invalid password.'
            });
        }

        // Mark re-auth time for audit
        req.reAuthAt = new Date();

        next();
    } catch (error) {
        res.status(500).json({ success: false, message: 'Re-authentication error' });
    }
};

/**
 * Rate limiting for bulk operations (10 per hour)
 */
const bulkOperationsStore = new Map();

const rateLimitBulk = (req, res, next) => {
    const userId = req.user.id.toString();
    const now = Date.now();
    const hourAgo = now - (60 * 60 * 1000);

    // Get user's operations
    let operations = bulkOperationsStore.get(userId) || [];

    // Filter to last hour
    operations = operations.filter(ts => ts > hourAgo);

    if (operations.length >= 10) {
        return res.status(429).json({
            success: false,
            message: 'Rate limit exceeded. Maximum 10 bulk operations per hour.',
            retryAfter: Math.ceil((operations[0] + 3600000 - now) / 60000) + ' minutes'
        });
    }

    // Record this operation
    operations.push(now);
    bulkOperationsStore.set(userId, operations);

    next();
};

/**
 * File validation middleware
 */
const validateFile = (allowedTypes = ['json', 'csv', 'xlsx']) => {
    return (req, res, next) => {
        if (!req.file) {
            return res.status(400).json({ success: false, message: 'No file uploaded' });
        }

        const ext = req.file.originalname.split('.').pop().toLowerCase();
        const mimeTypes = {
            'json': ['application/json'],
            'csv': ['text/csv', 'application/csv'],
            'xlsx': ['application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'],
            'xls': ['application/vnd.ms-excel'],
            'pdf': ['application/pdf'],
            'doc': ['application/msword'],
            'docx': ['application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
            'image': ['image/png', 'image/jpeg', 'image/jpg']
        };

        // Check extension
        if (!allowedTypes.includes(ext)) {
            return res.status(400).json({
                success: false,
                message: `File type .${ext} not allowed. Allowed: ${allowedTypes.join(', ')}`
            });
        }

        // Check size (50MB max)
        if (req.file.size > 50 * 1024 * 1024) {
            return res.status(400).json({
                success: false,
                message: 'File size exceeds 50MB limit'
            });
        }

        req.fileType = ext;
        next();
    };
};

/**
 * Audit logging for operator actions
 */
const auditOperatorAction = (action) => {
    return async (req, res, next) => {
        // Store original json method
        const originalJson = res.json.bind(res);

        // Override json to log after response
        res.json = async (data) => {
            // Log the action
            try {
                await AuditLog.log({
                    action,
                    actorId: req.user.id,
                    actorModel: 'User',
                    actorName: req.user.name,
                    actorRole: req.user.role,
                    targetType: req.body.targetEntity || 'system',
                    details: data.success ? 'Operation successful' : data.message,
                    metadata: {
                        endpoint: req.originalUrl,
                        method: req.method,
                        success: data.success
                    },
                    ip: req.ip,
                    reAuthAt: req.reAuthAt,
                    severity: data.success ? 'INFO' : 'WARNING'
                });
            } catch (err) {
                console.error('Audit log failed:', err);
            }

            return originalJson(data);
        };

        next();
    };
};

module.exports = {
    requireOperator,
    requireReAuth,
    rateLimitBulk,
    validateFile,
    auditOperatorAction
};
