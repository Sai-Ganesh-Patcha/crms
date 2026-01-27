/**
 * Operator Controller
 * CRMS Backend
 * 
 * Handles entity management, validation, and result publishing
 */

const { User, Student, Department, Subject, Regulation, Marks, Result, AuditLog } = require('../models');
const config = require('../config/constants');
const gpaService = require('../services/gpaService');

// ======================
// Entity Management
// ======================

/**
 * Get all students with pagination
 */
exports.getStudents = async (req, res) => {
    try {
        const { page = 1, limit = 50, search, semester, batch } = req.query;

        const query = { isActive: true };
        if (search) {
            query.$or = [
                { regno: new RegExp(search, 'i') },
                { name: new RegExp(search, 'i') }
            ];
        }
        if (semester) query.currentSemester = parseInt(semester);
        if (batch) query.batchYear = parseInt(batch);

        const students = await Student.find(query)
            .populate('departmentId', 'name code')
            .populate('regulationId', 'code')
            .skip((page - 1) * limit)
            .limit(parseInt(limit))
            .sort({ regno: 1 });

        const total = await Student.countDocuments(query);

        res.json({
            success: true,
            data: students,
            pagination: { page: parseInt(page), limit: parseInt(limit), total, pages: Math.ceil(total / limit) }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

/**
 * Create student
 */
exports.createStudent = async (req, res) => {
    try {
        const student = await Student.create(req.body);

        await AuditLog.log({
            action: 'USER_CREATED',
            actorId: req.user.id,
            actorModel: 'User',
            actorName: req.user.name,
            actorRole: req.user.role,
            targetType: 'student',
            targetId: student._id,
            details: `Created student: ${student.regno}`,
            afterState: { regno: student.regno, name: student.name },
            ip: req.ip
        });

        res.status(201).json({ success: true, data: student });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

/**
 * Update student
 */
exports.updateStudent = async (req, res) => {
    try {
        const { id } = req.params;
        const beforeState = await Student.findById(id).lean();

        const student = await Student.findByIdAndUpdate(id, req.body, { new: true, runValidators: true });

        await AuditLog.log({
            action: 'USER_UPDATED',
            actorId: req.user.id,
            actorModel: 'User',
            actorName: req.user.name,
            actorRole: req.user.role,
            targetType: 'student',
            targetId: id,
            beforeState,
            afterState: student.toObject(),
            ip: req.ip
        });

        res.json({ success: true, data: student });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

/**
 * Bulk create students
 */
exports.bulkCreateStudents = async (req, res) => {
    try {
        const { students } = req.body;

        if (!Array.isArray(students) || students.length === 0) {
            return res.status(400).json({ success: false, message: 'Students array required' });
        }

        const results = { created: 0, failed: 0, errors: [] };

        for (const studentData of students) {
            try {
                await Student.create(studentData);
                results.created++;
            } catch (err) {
                results.failed++;
                results.errors.push({ regno: studentData.regno, error: err.message });
            }
        }

        await AuditLog.log({
            action: 'USER_CREATED',
            actorId: req.user.id,
            actorModel: 'User',
            actorRole: req.user.role,
            targetType: 'student',
            details: `Bulk created ${results.created} students`,
            metadata: { created: results.created, failed: results.failed },
            changeType: 'BULK',
            affectedCount: results.created,
            ip: req.ip,
            severity: 'INFO'
        });

        res.json({ success: true, ...results });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

/**
 * Get faculty
 */
exports.getFaculty = async (req, res) => {
    try {
        const faculty = await User.find({ role: { $in: ['faculty', 'hod'] }, isActive: true })
            .populate('departmentId', 'name code')
            .sort({ name: 1 });
        res.json({ success: true, data: faculty });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

/**
 * Create faculty
 */
exports.createFaculty = async (req, res) => {
    try {
        const faculty = await User.create({ ...req.body, role: req.body.role || 'faculty' });
        res.status(201).json({ success: true, data: faculty });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

/**
 * Update faculty
 */
exports.updateFaculty = async (req, res) => {
    try {
        const { id } = req.params;
        delete req.body.password; // Use separate password change
        const faculty = await User.findByIdAndUpdate(id, req.body, { new: true });
        res.json({ success: true, data: faculty });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

/**
 * Get departments
 */
exports.getDepartments = async (req, res) => {
    try {
        const departments = await Department.find({ isActive: true })
            .populate('hodId', 'name');
        res.json({ success: true, data: departments });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

/**
 * Create department
 */
exports.createDepartment = async (req, res) => {
    try {
        const department = await Department.create(req.body);
        res.status(201).json({ success: true, data: department });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

/**
 * Update department
 */
exports.updateDepartment = async (req, res) => {
    try {
        const { id } = req.params;
        const department = await Department.findByIdAndUpdate(id, req.body, { new: true });
        res.json({ success: true, data: department });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

/**
 * Get subjects
 */
exports.getSubjects = async (req, res) => {
    try {
        const { semester, regulation } = req.query;
        const query = { isActive: true };
        if (semester) query.semester = parseInt(semester);
        if (regulation) query.regulationId = regulation;

        const subjects = await Subject.find(query)
            .populate('regulationId', 'code')
            .sort({ semester: 1, code: 1 });
        res.json({ success: true, data: subjects });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

/**
 * Create subject
 */
exports.createSubject = async (req, res) => {
    try {
        const subject = await Subject.create(req.body);
        res.status(201).json({ success: true, data: subject });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

/**
 * Update subject
 */
exports.updateSubject = async (req, res) => {
    try {
        const { id } = req.params;
        const subject = await Subject.findByIdAndUpdate(id, req.body, { new: true });
        res.json({ success: true, data: subject });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

/**
 * Bulk create subjects
 */
exports.bulkCreateSubjects = async (req, res) => {
    try {
        const { subjects, regulationId } = req.body;

        const results = { created: 0, failed: 0, errors: [] };

        for (const subjectData of subjects) {
            try {
                await Subject.create({ ...subjectData, regulationId });
                results.created++;
            } catch (err) {
                results.failed++;
                results.errors.push({ code: subjectData.code, error: err.message });
            }
        }

        res.json({ success: true, ...results });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

/**
 * Get regulations
 */
exports.getRegulations = async (req, res) => {
    try {
        const regulations = await Regulation.find({ isActive: true });
        res.json({ success: true, data: regulations });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

/**
 * Create regulation
 */
exports.createRegulation = async (req, res) => {
    try {
        const regulation = await Regulation.create(req.body);
        res.status(201).json({ success: true, data: regulation });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// ======================
// Validation Center
// ======================

/**
 * Get validation issues
 */
exports.getValidationIssues = async (req, res) => {
    try {
        const { semester, academicYear } = req.query;

        const issues = [];

        // Find missing marks
        const students = await Student.find({ isActive: true, currentSemester: { $gte: semester } });
        const subjects = await Subject.find({ semester: parseInt(semester), isActive: true });

        for (const student of students) {
            for (const subject of subjects) {
                const marks = await Marks.findOne({
                    studentId: student._id,
                    subjectId: subject._id,
                    semester: parseInt(semester)
                });

                if (!marks) {
                    issues.push({
                        type: 'MISSING_MARKS',
                        severity: 'ERROR',
                        student: { regno: student.regno, name: student.name },
                        subject: { code: subject.code, name: subject.name },
                        message: 'Marks not entered'
                    });
                } else if (marks.internalMarks === null || marks.externalMarks === null) {
                    issues.push({
                        type: 'INCOMPLETE_MARKS',
                        severity: 'ERROR',
                        student: { regno: student.regno, name: student.name },
                        subject: { code: subject.code, name: subject.name },
                        message: 'Marks incomplete'
                    });
                }
            }
        }

        res.json({ success: true, data: issues, count: issues.length });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

/**
 * Run validation
 */
exports.runValidation = async (req, res) => {
    try {
        const { semester, academicYear } = req.body;

        // Count marks by status
        const stats = await Marks.aggregate([
            { $match: { semester: parseInt(semester), academicYear } },
            { $group: { _id: '$status', count: { $sum: 1 } } }
        ]);

        const statusCounts = {};
        stats.forEach(s => statusCounts[s._id] = s.count);

        res.json({
            success: true,
            data: {
                semester,
                academicYear,
                statusCounts,
                readyToPublish: !statusCounts.DRAFT && !statusCounts.LOCKED,
                blockers: statusCounts.DRAFT ? `${statusCounts.DRAFT} marks still in draft` : null
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

/**
 * Get semester validation
 */
exports.getSemesterValidation = async (req, res) => {
    try {
        const { semester } = req.params;
        const { academicYear } = req.query;

        const subjects = await Subject.find({ semester: parseInt(semester), isActive: true });
        const subjectStatus = [];

        for (const subject of subjects) {
            const marks = await Marks.find({ subjectId: subject._id, semester: parseInt(semester) });
            const byStatus = {};
            marks.forEach(m => {
                byStatus[m.status] = (byStatus[m.status] || 0) + 1;
            });

            subjectStatus.push({
                subject: { code: subject.code, name: subject.name },
                totalMarks: marks.length,
                statusBreakdown: byStatus
            });
        }

        res.json({ success: true, data: subjectStatus });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// ======================
// Result Lifecycle
// ======================

/**
 * Get results status overview
 */
exports.getResultsStatus = async (req, res) => {
    try {
        const semesters = await Marks.aggregate([
            {
                $group: {
                    _id: { semester: '$semester', academicYear: '$academicYear', status: '$status' },
                    count: { $sum: 1 }
                }
            },
            { $sort: { '_id.semester': 1 } }
        ]);

        res.json({ success: true, data: semesters });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

/**
 * Get semester summary before publish
 */
exports.getSemesterSummary = async (req, res) => {
    try {
        const { semester } = req.params;
        const { academicYear } = req.query;

        const marks = await Marks.find({
            semester: parseInt(semester),
            academicYear,
            status: 'VERIFIED'
        }).populate('studentId', 'regno name').populate('subjectId', 'code name credits');

        // Group by student
        const studentMarks = {};
        marks.forEach(m => {
            const regno = m.studentId.regno;
            if (!studentMarks[regno]) {
                studentMarks[regno] = {
                    student: m.studentId,
                    subjects: [],
                    totalCredits: 0,
                    earnedCredits: 0,
                    totalPoints: 0
                };
            }
            studentMarks[regno].subjects.push({
                code: m.subjectId.code,
                grade: m.grade,
                credits: m.subjectId.credits
            });
            studentMarks[regno].totalCredits += m.subjectId.credits;
            if (m.grade !== 'F') {
                studentMarks[regno].earnedCredits += m.subjectId.credits;
                studentMarks[regno].totalPoints += m.gradePoints * m.subjectId.credits;
            }
        });

        // Calculate SGPA and counts
        let passCount = 0, failCount = 0;
        const sgpaDistribution = { '9-10': 0, '8-9': 0, '7-8': 0, '6-7': 0, '5-6': 0, '<5': 0 };

        Object.values(studentMarks).forEach(sm => {
            const sgpa = sm.earnedCredits > 0 ? sm.totalPoints / sm.earnedCredits : 0;
            sm.sgpa = parseFloat(sgpa.toFixed(2));

            if (sm.subjects.some(s => s.grade === 'F')) {
                failCount++;
            } else {
                passCount++;
            }

            if (sgpa >= 9) sgpaDistribution['9-10']++;
            else if (sgpa >= 8) sgpaDistribution['8-9']++;
            else if (sgpa >= 7) sgpaDistribution['7-8']++;
            else if (sgpa >= 6) sgpaDistribution['6-7']++;
            else if (sgpa >= 5) sgpaDistribution['5-6']++;
            else sgpaDistribution['<5']++;
        });

        res.json({
            success: true,
            data: {
                semester: parseInt(semester),
                academicYear,
                totalStudents: Object.keys(studentMarks).length,
                passCount,
                failCount,
                passPercentage: ((passCount / Object.keys(studentMarks).length) * 100).toFixed(1),
                sgpaDistribution
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

/**
 * Lock semester marks
 */
exports.lockSemesterMarks = async (req, res) => {
    try {
        const { semester, academicYear, remarks } = req.body;

        // Check all marks are verified
        const unverified = await Marks.countDocuments({
            semester: parseInt(semester),
            academicYear,
            status: { $in: ['DRAFT'] }
        });

        if (unverified > 0) {
            return res.status(400).json({
                success: false,
                message: `${unverified} marks still in draft. Cannot lock.`
            });
        }

        const result = await Marks.updateMany(
            { semester: parseInt(semester), academicYear, status: 'LOCKED' },
            { status: 'VERIFIED', verifiedAt: new Date(), verifiedBy: req.user.id }
        );

        res.json({
            success: true,
            message: `Verified ${result.modifiedCount} marks`,
            modifiedCount: result.modifiedCount
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

/**
 * Publish results (creates immutable snapshots)
 */
exports.publishResults = async (req, res) => {
    try {
        const { semester, academicYear, remarks } = req.body;

        // Validate all marks are verified
        const unverified = await Marks.countDocuments({
            semester: parseInt(semester),
            academicYear,
            status: { $ne: 'VERIFIED' }
        });

        if (unverified > 0) {
            return res.status(400).json({
                success: false,
                message: `${unverified} marks not verified. Cannot publish.`,
                code: 'VALIDATION_FAILED'
            });
        }

        // Get all students with marks
        const studentMarks = await Marks.aggregate([
            { $match: { semester: parseInt(semester), academicYear, status: 'VERIFIED' } },
            { $lookup: { from: 'subjects', localField: 'subjectId', foreignField: '_id', as: 'subject' } },
            { $unwind: '$subject' },
            { $lookup: { from: 'students', localField: 'studentId', foreignField: '_id', as: 'student' } },
            { $unwind: '$student' },
            {
                $group: {
                    _id: '$studentId',
                    student: { $first: '$student' },
                    subjects: {
                        $push: {
                            subjectId: '$subjectId',
                            code: '$subject.code',
                            name: '$subject.name',
                            credits: '$subject.credits',
                            internalMarks: '$internalMarks',
                            externalMarks: '$externalMarks',
                            totalMarks: '$totalMarks',
                            grade: '$grade',
                            gradePoints: { $multiply: ['$gradePoints', '$subject.credits'] }
                        }
                    }
                }
            }
        ]);

        const results = [];
        const errors = [];

        for (const sm of studentMarks) {
            try {
                let totalCredits = 0, earnedCredits = 0, totalGradePoints = 0;
                const backlogs = [];

                sm.subjects.forEach(s => {
                    totalCredits += s.credits;
                    if (s.grade === 'F') {
                        backlogs.push({ subjectId: s.subjectId, code: s.code, name: s.name });
                    } else {
                        earnedCredits += s.credits;
                        totalGradePoints += s.gradePoints;
                    }
                });

                const sgpa = earnedCredits > 0 ? parseFloat((totalGradePoints / earnedCredits).toFixed(2)) : 0;

                // Mark previous as not latest
                await Result.updateMany(
                    { studentId: sm._id, semester: parseInt(semester), isLatest: true },
                    { isLatest: false }
                );

                // Create immutable result
                const result = await Result.create({
                    studentId: sm._id,
                    semester: parseInt(semester),
                    academicYear,
                    regulationId: sm.student.regulationId,
                    subjects: sm.subjects,
                    totalCredits,
                    earnedCredits,
                    totalGradePoints,
                    sgpa,
                    status: backlogs.length > 0 ? 'FAIL' : 'PASS',
                    backlogs,
                    publishedBy: req.user.id,
                    isLatest: true
                });

                results.push(result);

                // Update marks status
                await Marks.updateMany(
                    { studentId: sm._id, semester: parseInt(semester), academicYear },
                    { status: 'PUBLISHED' }
                );
            } catch (err) {
                errors.push({ student: sm.student.regno, error: err.message });
            }
        }

        await AuditLog.log({
            action: 'RESULT_PUBLISHED',
            actorId: req.user.id,
            actorModel: 'User',
            actorName: req.user.name,
            actorRole: req.user.role,
            targetType: 'semester',
            details: remarks || `Published semester ${semester}`,
            metadata: {
                semester,
                academicYear,
                publishedCount: results.length,
                errors: errors.length
            },
            changeType: 'BULK',
            affectedCount: results.length,
            ip: req.ip,
            reAuthAt: req.reAuthAt,
            severity: 'CRITICAL'
        });

        res.json({
            success: true,
            message: `Published ${results.length} results`,
            publishedCount: results.length,
            errors: errors.length > 0 ? errors : undefined
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

/**
 * Create correction (new version)
 */
exports.createCorrection = async (req, res) => {
    try {
        const { resultId, corrections, reason } = req.body;

        const originalResult = await Result.findById(resultId);
        if (!originalResult) {
            return res.status(404).json({ success: false, message: 'Result not found' });
        }

        // Mark original as not latest
        originalResult.isLatest = false;
        await originalResult.save();

        // Create corrected result
        const correctedSubjects = [...originalResult.subjects];
        corrections.forEach(c => {
            const idx = correctedSubjects.findIndex(s => s.code === c.subjectCode);
            if (idx !== -1) {
                correctedSubjects[idx].grade = c.newGrade;
                correctedSubjects[idx].gradePoints = config.gradeScale[c.newGrade]?.points * correctedSubjects[idx].credits || 0;
            }
        });

        // Recalculate SGPA
        let earnedCredits = 0, totalGradePoints = 0;
        const backlogs = [];
        correctedSubjects.forEach(s => {
            if (s.grade === 'F') {
                backlogs.push({ subjectId: s.subjectId, code: s.code, name: s.name });
            } else {
                earnedCredits += s.credits;
                totalGradePoints += s.gradePoints;
            }
        });

        const newSgpa = earnedCredits > 0 ? parseFloat((totalGradePoints / earnedCredits).toFixed(2)) : 0;

        const correctedResult = await Result.create({
            studentId: originalResult.studentId,
            semester: originalResult.semester,
            academicYear: originalResult.academicYear,
            regulationId: originalResult.regulationId,
            subjects: correctedSubjects,
            totalCredits: originalResult.totalCredits,
            earnedCredits,
            totalGradePoints,
            sgpa: newSgpa,
            status: backlogs.length > 0 ? 'FAIL' : 'PASS',
            backlogs,
            publishedBy: req.user.id,
            version: originalResult.version + 1,
            previousVersion: originalResult._id,
            isLatest: true
        });

        await AuditLog.log({
            action: 'RESULT_CORRECTION',
            actorId: req.user.id,
            actorModel: 'User',
            actorName: req.user.name,
            actorRole: req.user.role,
            targetType: 'result',
            targetId: correctedResult._id,
            details: reason,
            beforeState: { sgpa: originalResult.sgpa, version: originalResult.version },
            afterState: { sgpa: newSgpa, version: correctedResult.version },
            ip: req.ip,
            reAuthAt: req.reAuthAt,
            severity: 'CRITICAL'
        });

        res.json({
            success: true,
            data: correctedResult,
            previousVersion: originalResult._id
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// ======================
// Audit Logs
// ======================

/**
 * Get audit logs (own actions only for operator)
 */
exports.getAuditLogs = async (req, res) => {
    try {
        const { page = 1, limit = 50, action, from, to } = req.query;

        const query = { actorId: req.user.id };
        if (action) query.action = action;
        if (from || to) {
            query.createdAt = {};
            if (from) query.createdAt.$gte = new Date(from);
            if (to) query.createdAt.$lte = new Date(to);
        }

        const logs = await AuditLog.find(query)
            .skip((page - 1) * limit)
            .limit(parseInt(limit))
            .sort({ createdAt: -1 });

        const total = await AuditLog.countDocuments(query);

        res.json({
            success: true,
            data: logs,
            pagination: { page: parseInt(page), limit: parseInt(limit), total }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

/**
 * Export audit logs
 */
exports.exportAuditLogs = async (req, res) => {
    try {
        const { from, to, format = 'json' } = req.query;

        const query = { actorId: req.user.id };
        if (from || to) {
            query.createdAt = {};
            if (from) query.createdAt.$gte = new Date(from);
            if (to) query.createdAt.$lte = new Date(to);
        }

        const logs = await AuditLog.find(query).sort({ createdAt: -1 });

        if (format === 'csv') {
            // Simple CSV export
            const csv = ['Timestamp,Action,Details,Severity']
                .concat(logs.map(l => `${l.createdAt.toISOString()},${l.action},"${l.details || ''}",${l.severity}`))
                .join('\n');

            res.setHeader('Content-Type', 'text/csv');
            res.setHeader('Content-Disposition', 'attachment; filename=audit-logs.csv');
            return res.send(csv);
        }

        res.json({ success: true, data: logs });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// ======================
// Dashboard Stats
// ======================

/**
 * Get dashboard statistics
 */
exports.getDashboardStats = async (req, res) => {
    try {
        const [
            totalStudents,
            totalFaculty,
            totalSubjects,
            totalResults,
            pendingMarks,
            recentActivity
        ] = await Promise.all([
            Student.countDocuments({ isActive: true }),
            User.countDocuments({ role: { $in: ['faculty', 'hod'] }, isActive: true }),
            Subject.countDocuments({ isActive: true }),
            Result.countDocuments({ isLatest: true }),
            Marks.countDocuments({ status: { $in: ['DRAFT', 'LOCKED'] } }),
            AuditLog.countDocuments({
                actorId: req.user.id,
                createdAt: { $gte: new Date(Date.now() - 24 * 60 * 60 * 1000) }
            })
        ]);

        res.json({
            success: true,
            data: {
                totalStudents,
                totalFaculty,
                totalSubjects,
                totalResults,
                pendingMarks,
                recentActivity
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
