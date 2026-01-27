/**
 * Role-Based Access Control Middleware
 * CRMS Backend
 */

const config = require('../config/constants');

/**
 * Require specific roles
 * @param {string|string[]} allowedRoles - Allowed role(s)
 */
const requireRole = (...allowedRoles) => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({
                success: false,
                message: 'Authentication required'
            });
        }

        const roles = allowedRoles.flat();

        if (!roles.includes(req.user.role)) {
            return res.status(403).json({
                success: false,
                message: 'Access denied. Insufficient permissions.'
            });
        }

        next();
    };
};

/**
 * Student can only access own data
 */
const requireOwnData = (req, res, next) => {
    if (req.user.role !== 'student') {
        return next(); // Non-students have broader access
    }

    const requestedRegno = req.params.regno || req.query.regno;

    if (requestedRegno && requestedRegno !== req.user.regno) {
        return res.status(403).json({
            success: false,
            message: 'Access denied. You can only view your own data.'
        });
    }

    next();
};

/**
 * Faculty can only access assigned subjects
 */
const requireSubjectAssignment = async (req, res, next) => {
    if (req.user.role === 'admin' || req.user.role === 'hod') {
        return next(); // Admin and HOD have full access
    }

    if (req.user.role !== 'faculty') {
        return res.status(403).json({
            success: false,
            message: 'Only faculty can perform this action'
        });
    }

    const { User } = require('../models');
    const user = await User.findById(req.user.id);

    const subjectId = req.params.subjectId || req.body.subjectId;

    if (!user.assignedSubjects.includes(subjectId)) {
        return res.status(403).json({
            success: false,
            message: 'You are not assigned to this subject'
        });
    }

    next();
};

/**
 * HOD can only access own department
 */
const requireDepartmentAccess = async (req, res, next) => {
    if (req.user.role === 'admin') {
        return next(); // Admin has access to all departments
    }

    const { User } = require('../models');
    const user = await User.findById(req.user.id);

    const departmentId = req.params.departmentId || req.query.departmentId;

    if (departmentId && !user.departmentId.equals(departmentId)) {
        return res.status(403).json({
            success: false,
            message: 'You can only access your own department'
        });
    }

    next();
};

module.exports = {
    requireRole,
    requireOwnData,
    requireSubjectAssignment,
    requireDepartmentAccess
};
