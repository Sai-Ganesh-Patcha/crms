/**
 * Application Constants
 */

module.exports = {
    roles: {
        ADMIN: 'admin',
        HOD: 'hod',
        FACULTY: 'faculty',
        STUDENT: 'student',
        OPERATOR: 'operator'
    },
    security: {
        bcryptRounds: 10,
        jwtSecret: process.env.JWT_SECRET || 'dev_secret',
        jwtExpire: process.env.JWT_EXPIRE || '24h'
    },
    upload: {
        maxSize: 5 * 1024 * 1024, // 5MB
        allowedTypes: ['image/jpeg', 'image/png', 'application/pdf']
    },
    resultStatus: {
        DRAFT: 'DRAFT',
        LOCKED: 'LOCKED',
        VERIFIED: 'VERIFIED',
        PUBLISHED: 'PUBLISHED'
    },
    gradeScale: {
        S: { minMarks: 90, points: 10 },
        A: { minMarks: 80, points: 9 },
        B: { minMarks: 70, points: 8 },
        C: { minMarks: 60, points: 7 },
        D: { minMarks: 50, points: 6 },
        E: { minMarks: 40, points: 5 },
        F: { minMarks: 0, points: 0 }
    }
};
