/**
 * Application Configuration
 * CRMS Backend
 */

module.exports = {
    // JWT Configuration
    jwt: {
        secret: process.env.JWT_SECRET,
        expiresIn: process.env.JWT_EXPIRES_IN || '15m',
        refreshSecret: process.env.JWT_REFRESH_SECRET,
        refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d'
    },

    // Security Configuration
    security: {
        bcryptRounds: parseInt(process.env.BCRYPT_ROUNDS) || 12,
        rateLimitWindow: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 900000, // 15 min
        rateLimitMax: parseInt(process.env.RATE_LIMIT_MAX) || 100
    },

    // Grade Scale (R23 Regulation)
    gradeScale: {
        S: { points: 10, minMarks: 90 },
        A: { points: 9, minMarks: 80 },
        B: { points: 8, minMarks: 70 },
        C: { points: 7, minMarks: 60 },
        D: { points: 6, minMarks: 50 },
        E: { points: 5, minMarks: 40 },
        F: { points: 0, minMarks: 0 }
    },

    // Result Status Enum
    resultStatus: {
        DRAFT: 'DRAFT',
        LOCKED: 'LOCKED',
        VERIFIED: 'VERIFIED',
        PUBLISHED: 'PUBLISHED'
    },

    // Roles (hierarchy: admin > operator > hod > faculty > student)
    roles: {
        STUDENT: 'student',
        FACULTY: 'faculty',
        HOD: 'hod',
        OPERATOR: 'operator',  // Academic Operations - Bulk data, publishing
        ADMIN: 'admin'
    },

    // Session timeouts (ms)
    sessionTimeout: {
        default: 2 * 60 * 60 * 1000,     // 2 hours
        operator: 30 * 60 * 1000          // 30 minutes (stricter)
    }
};
