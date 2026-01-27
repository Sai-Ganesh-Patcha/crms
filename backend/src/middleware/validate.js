/**
 * Request Validation Middleware
 * CRMS Backend
 */

const { body, param, query, validationResult } = require('express-validator');

/**
 * Handle validation errors
 */
const validate = (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({
            success: false,
            message: 'Validation failed',
            errors: errors.array().map(e => ({
                field: e.path,
                message: e.msg
            }))
        });
    }

    next();
};

/**
 * Auth validation rules
 */
const authRules = {
    login: [
        body('username')
            .trim()
            .notEmpty().withMessage('Username is required')
            .isLength({ max: 50 }).withMessage('Username too long'),
        body('password')
            .notEmpty().withMessage('Password is required'),
        body('role')
            .isIn(['student', 'faculty', 'hod', 'admin'])
            .withMessage('Invalid role')
    ],

    changePassword: [
        body('currentPassword')
            .notEmpty().withMessage('Current password is required'),
        body('newPassword')
            .isLength({ min: 6 }).withMessage('Password must be at least 6 characters')
            .isLength({ max: 128 }).withMessage('Password too long')
    ]
};

/**
 * Marks validation rules
 */
const marksRules = {
    enter: [
        body('studentId')
            .isMongoId().withMessage('Invalid student ID'),
        body('subjectId')
            .isMongoId().withMessage('Invalid subject ID'),
        body('internalMarks')
            .optional()
            .isInt({ min: 0, max: 40 }).withMessage('Internal marks must be 0-40'),
        body('externalMarks')
            .optional()
            .isInt({ min: 0, max: 60 }).withMessage('External marks must be 0-60')
    ],

    lock: [
        body('subjectId')
            .isMongoId().withMessage('Invalid subject ID'),
        body('semester')
            .isInt({ min: 1, max: 8 }).withMessage('Invalid semester')
    ]
};

/**
 * Student validation rules
 */
const studentRules = {
    getResults: [
        param('regno')
            .optional()
            .matches(/^\d{2}K\d{2}[A-Z]\d{4}$/i)
            .withMessage('Invalid registration number format')
    ]
};

module.exports = {
    validate,
    authRules,
    marksRules,
    studentRules
};
