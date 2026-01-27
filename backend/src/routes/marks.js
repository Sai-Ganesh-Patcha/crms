/**
 * Marks Routes
 * CRMS Backend
 */

const express = require('express');
const router = express.Router();
const marksController = require('../controllers/marksController');
const { auth, rbac } = require('../middleware');
const { validate, marksRules } = require('../middleware/validate');

// All routes require authentication
router.use(auth.verifyToken);

// Faculty: Enter/Update marks (only for assigned subjects)
router.post('/',
    rbac.requireRole('faculty'),
    marksRules.enter,
    validate,
    marksController.enterMarks
);

router.put('/:markId',
    rbac.requireRole('faculty'),
    marksController.updateMarks
);

// Faculty: Lock marks for a subject
router.post('/lock',
    rbac.requireRole('faculty'),
    marksRules.lock,
    validate,
    marksController.lockMarks
);

// HOD: Verify marks
router.post('/verify',
    rbac.requireRole('hod'),
    marksController.verifyMarks
);

// View marks (faculty sees own subjects, HOD/admin sees all)
router.get('/subject/:subjectId/semester/:semester',
    rbac.requireRole('faculty', 'hod', 'admin'),
    marksController.getMarksBySubject
);

module.exports = router;
