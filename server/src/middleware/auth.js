/**
 * JWT Authentication Middleware
 * CRMS Backend
 */

const jwt = require('jsonwebtoken');
const config = require('../config/constants');
const { User, Student } = require('../models');

/**
 * Verify JWT token from Authorization header
 */
const verifyToken = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({
                success: false,
                message: 'Access denied. No token provided.'
            });
        }

        const token = authHeader.split(' ')[1];

        const decoded = jwt.verify(token, config.jwt.secret);

        // Fetch user based on type
        if (decoded.type === 'student') {
            const student = await Student.findById(decoded.id);
            if (!student || !student.isActive || student.isSuspended) {
                return res.status(401).json({
                    success: false,
                    message: 'Account is inactive or suspended'
                });
            }
            req.user = {
                id: student._id,
                regno: student.regno,
                name: student.name,
                role: 'student',
                type: 'student'
            };
        } else {
            const user = await User.findById(decoded.id);
            if (!user || !user.isActive) {
                return res.status(401).json({
                    success: false,
                    message: 'Account is inactive'
                });
            }
            req.user = {
                id: user._id,
                username: user.username,
                name: user.name,
                role: user.role,
                type: 'user'
            };
        }

        next();
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({
                success: false,
                message: 'Token expired',
                code: 'TOKEN_EXPIRED'
            });
        }

        return res.status(401).json({
            success: false,
            message: 'Invalid token'
        });
    }
};

/**
 * Generate access and refresh tokens
 */
const generateTokens = (payload) => {
    const accessToken = jwt.sign(payload, config.jwt.secret, {
        expiresIn: config.jwt.expiresIn
    });

    const refreshToken = jwt.sign(payload, config.jwt.refreshSecret, {
        expiresIn: config.jwt.refreshExpiresIn
    });

    return { accessToken, refreshToken };
};

/**
 * Verify refresh token
 */
const verifyRefreshToken = (token) => {
    return jwt.verify(token, config.jwt.refreshSecret);
};

module.exports = {
    verifyToken,
    generateTokens,
    verifyRefreshToken
};
