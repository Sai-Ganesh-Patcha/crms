/**
 * Operator Routes
 * CRMS Backend
 * 
 * Academic Operations Dashboard - Entity management, ingestion, publishing
 */

const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');

const operatorController = require('../controllers/operatorController');
const ingestionController = require('../controllers/ingestionController');
const { auth, operator } = require('../middleware');

// Multer config for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, '../../uploads'));
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + '-' + file.originalname);
    }
});

const upload = multer({
    storage,
    limits: { fileSize: 50 * 1024 * 1024 } // 50MB
});

// All routes require auth + operator role
router.use(auth.verifyToken);
router.use(operator.requireOperator);

// ======================
// Entity Management
// ======================

// Students
router.get('/entities/students', operatorController.getStudents);
router.post('/entities/students', operatorController.createStudent);
router.put('/entities/students/:id', operatorController.updateStudent);
router.post('/entities/students/bulk', operator.rateLimitBulk, operatorController.bulkCreateStudents);

// Faculty
router.get('/entities/faculty', operatorController.getFaculty);
router.post('/entities/faculty', operatorController.createFaculty);
router.put('/entities/faculty/:id', operatorController.updateFaculty);

// Departments
router.get('/entities/departments', operatorController.getDepartments);
router.post('/entities/departments', operatorController.createDepartment);
router.put('/entities/departments/:id', operatorController.updateDepartment);

// Subjects
router.get('/entities/subjects', operatorController.getSubjects);
router.post('/entities/subjects', operatorController.createSubject);
router.put('/entities/subjects/:id', operatorController.updateSubject);
router.post('/entities/subjects/bulk', operator.rateLimitBulk, operatorController.bulkCreateSubjects);

// Regulations
router.get('/entities/regulations', operatorController.getRegulations);
router.post('/entities/regulations', operatorController.createRegulation);

// ======================
// Data Ingestion
// ======================

router.post('/ingest/upload',
    operator.rateLimitBulk,
    upload.single('file'),
    operator.validateFile(['json', 'csv', 'xlsx', 'pdf', 'doc', 'docx']),
    operator.auditOperatorAction('DATA_UPLOAD'),
    ingestionController.uploadFile
);

router.get('/ingest/jobs', ingestionController.getJobs);
router.get('/ingest/jobs/:jobId', ingestionController.getJob);
router.get('/ingest/jobs/:jobId/preview', ingestionController.getPreview);
router.post('/ingest/jobs/:jobId/resolve-conflicts', ingestionController.resolveConflicts);
router.post('/ingest/jobs/:jobId/approve-preview', ingestionController.approvePreview);

router.post('/ingest/jobs/:jobId/commit',
    operator.requireReAuth,
    operator.auditOperatorAction('DATA_COMMIT'),
    ingestionController.commitJob
);

router.post('/ingest/jobs/:jobId/cancel', ingestionController.cancelJob);

// ======================
// Validation Center
// ======================

router.get('/validation/issues', operatorController.getValidationIssues);
router.post('/validation/run', operatorController.runValidation);
router.get('/validation/semester/:semester', operatorController.getSemesterValidation);

// ======================
// Result Lifecycle
// ======================

router.get('/results/status', operatorController.getResultsStatus);
router.get('/results/semester/:semester/summary', operatorController.getSemesterSummary);

router.post('/results/lock',
    operator.requireReAuth,
    operator.auditOperatorAction('MARKS_BULK_LOCK'),
    operatorController.lockSemesterMarks
);

router.post('/results/publish',
    operator.requireReAuth,
    operator.auditOperatorAction('RESULT_PUBLISHED'),
    operatorController.publishResults
);

router.post('/results/correct',
    operator.requireReAuth,
    operator.auditOperatorAction('RESULT_CORRECTION'),
    operatorController.createCorrection
);

// ======================
// Audit Logs
// ======================

router.get('/audit', operatorController.getAuditLogs);
router.get('/audit/export', operatorController.exportAuditLogs);

// ======================
// Dashboard Stats
// ======================

router.get('/dashboard/stats', operatorController.getDashboardStats);

module.exports = router;
