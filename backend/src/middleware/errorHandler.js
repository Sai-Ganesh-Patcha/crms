/**
 * Error Handler Middleware
 * CRMS Backend
 */

const { AuditLog } = require('../models');

/**
 * Not Found Handler
 */
const notFound = (req, res, next) => {
    const error = new Error(`Not Found - ${req.originalUrl}`);
    error.status = 404;
    next(error);
};

/**
 * Global Error Handler
 */
const errorHandler = async (err, req, res, next) => {
    const statusCode = err.status || err.statusCode || 500;

    // Log critical errors
    if (statusCode >= 500) {
        try {
            await AuditLog.log({
                action: 'SYSTEM_ERROR',
                details: err.message.substring(0, 500),
                metadata: {
                    stack: err.stack?.substring(0, 1000),
                    path: req.path,
                    method: req.method
                },
                ip: req.ip,
                severity: 'CRITICAL'
            });
        } catch (logError) {
            console.error('Failed to log error:', logError);
        }
    }

    // Don't expose stack traces in production
    const response = {
        success: false,
        message: err.message || 'Internal server error'
    };

    if (process.env.NODE_ENV === 'development') {
        response.stack = err.stack;
    }

    // Mongoose validation error
    if (err.name === 'ValidationError') {
        response.message = 'Validation failed';
        response.errors = Object.values(err.errors).map(e => ({
            field: e.path,
            message: e.message
        }));
        return res.status(400).json(response);
    }

    // Mongoose duplicate key error
    if (err.code === 11000) {
        response.message = 'Duplicate entry';
        response.field = Object.keys(err.keyValue)[0];
        return res.status(409).json(response);
    }

    // Mongoose cast error (invalid ObjectId)
    if (err.name === 'CastError') {
        response.message = 'Invalid ID format';
        return res.status(400).json(response);
    }

    res.status(statusCode).json(response);
};

module.exports = { notFound, errorHandler };
