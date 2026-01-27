/**
 * Student Routes
 * CRMS Backend
 */

const express = require('express');
const router = express.Router();
const studentController = require('../controllers/studentController');
const { auth, rbac } = require('../middleware');

// All routes require authentication
router.use(auth.verifyToken);

// Student can only access own results
router.get('/results',
    rbac.requireRole('student'),
    studentController.getOwnResults
);

router.get('/results/:semester',
    rbac.requireRole('student'),
    studentController.getSemesterResult
);

router.get('/transcript',
    rbac.requireRole('student'),
    studentController.getTranscript
);

// Admin/HOD/Faculty can view any student
router.get('/:regno/results',
    rbac.requireRole('faculty', 'hod', 'admin'),
    studentController.getStudentResults
);

module.exports = router;
