/**
 * Admin Controller
 * CRMS Backend
 */

const { User, Student, Marks, Result, AuditLog } = require('../models');
const config = require('../config/constants');

/**
 * Publish results for a semester
 * Creates immutable Result documents from verified Marks
 */
exports.publishResults = async (req, res) => {
    try {
        const { semester, academicYear, departmentId } = req.body;

        // Check all marks are verified
        const unverified = await Marks.countDocuments({
            semester,
            academicYear,
            status: { $ne: config.resultStatus.VERIFIED }
        });

        if (unverified > 0) {
            return res.status(400).json({
                success: false,
                message: `${unverified} marks are not verified. Cannot publish.`
            });
        }

        // Get all students for this semester
        const students = await Student.find({
            currentSemester: { $gte: semester },
            isActive: true
        });

        const results = [];
        const errors = [];

        for (const student of students) {
            try {
                // Get all marks for this student/semester
                const marks = await Marks.find({
                    studentId: student._id,
                    semester,
                    academicYear,
                    status: config.resultStatus.VERIFIED
                }).populate('subjectId');

                if (marks.length === 0) continue;

                // Calculate SGPA
                let totalCredits = 0;
                let earnedCredits = 0;
                let totalGradePoints = 0;
                const backlogs = [];
                const subjects = [];

                for (const m of marks) {
                    const credits = m.subjectId.credits;
                    totalCredits += credits;

                    subjects.push({
                        subjectId: m.subjectId._id,
                        code: m.subjectId.code,
                        name: m.subjectId.name,
                        credits,
                        internalMarks: m.internalMarks,
                        externalMarks: m.externalMarks,
                        totalMarks: m.totalMarks,
                        grade: m.grade,
                        gradePoints: m.gradePoints * credits
                    });

                    if (m.grade === 'F') {
                        backlogs.push({
                            subjectId: m.subjectId._id,
                            code: m.subjectId.code,
                            name: m.subjectId.name
                        });
                    } else {
                        earnedCredits += credits;
                        totalGradePoints += m.gradePoints * credits;
                    }
                }

                const sgpa = earnedCredits > 0 ? (totalGradePoints / earnedCredits).toFixed(2) : 0;
                const status = backlogs.length > 0 ? 'FAIL' : 'PASS';

                // Mark previous result as not latest
                await Result.updateMany(
                    { studentId: student._id, semester, isLatest: true },
                    { isLatest: false }
                );

                // Create immutable result
                const result = await Result.create({
                    studentId: student._id,
                    semester,
                    academicYear,
                    regulationId: student.regulationId,
                    subjects,
                    totalCredits,
                    earnedCredits,
                    totalGradePoints,
                    sgpa: parseFloat(sgpa),
                    status,
                    backlogs,
                    publishedBy: req.user.id,
                    isLatest: true
                });

                results.push(result);

                // Update marks status
                await Marks.updateMany(
                    { studentId: student._id, semester, academicYear },
                    { status: config.resultStatus.PUBLISHED }
                );

            } catch (err) {
                errors.push({ student: student.regno, error: err.message });
            }
        }

        await AuditLog.log({
            action: 'RESULT_PUBLISHED',
            actorId: req.user.id,
            actorModel: 'User',
            actorName: req.user.name,
            actorRole: req.user.role,
            details: `Published ${results.length} results for semester ${semester}`,
            metadata: { semester, academicYear, count: results.length, errors: errors.length },
            ip: req.ip,
            severity: 'CRITICAL'
        });

        res.json({
            success: true,
            message: `Published ${results.length} results`,
            errors: errors.length > 0 ? errors : undefined
        });

    } catch (error) {
        console.error('Publish error:', error);
        res.status(500).json({ success: false, message: error.message });
    }
};

/**
 * Rollback a result (creates new version)
 */
exports.rollbackResult = async (req, res) => {
    try {
        const { resultId } = req.params;
        const { reason } = req.body;

        const result = await Result.findById(resultId);
        if (!result) {
            return res.status(404).json({ success: false, message: 'Result not found' });
        }

        // Mark as not latest
        result.isLatest = false;
        await result.save();

        // Revert marks to verified status
        await Marks.updateMany(
            { studentId: result.studentId, semester: result.semester },
            { status: config.resultStatus.VERIFIED }
        );

        await AuditLog.log({
            action: 'RESULT_ROLLBACK',
            actorId: req.user.id,
            actorModel: 'User',
            actorName: req.user.name,
            actorRole: req.user.role,
            targetType: 'result',
            targetId: resultId,
            details: reason || 'Result rolled back by admin',
            ip: req.ip,
            severity: 'CRITICAL'
        });

        res.json({ success: true, message: 'Result rolled back' });

    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

/**
 * Get all users
 */
exports.getUsers = async (req, res) => {
    try {
        const users = await User.find().select('-refreshToken');
        res.json({ success: true, data: users });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

/**
 * Create user
 */
exports.createUser = async (req, res) => {
    try {
        const { username, password, name, email, role, departmentId } = req.body;

        const user = await User.create({ username, password, name, email, role, departmentId });

        await AuditLog.log({
            action: 'USER_CREATED',
            actorId: req.user.id,
            actorModel: 'User',
            targetType: 'user',
            targetId: user._id,
            details: `Created ${role}: ${username}`,
            ip: req.ip
        });

        res.status(201).json({ success: true, data: user });

    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

/**
 * Update user
 */
exports.updateUser = async (req, res) => {
    try {
        const { userId } = req.params;
        const updates = req.body;
        delete updates.password; // Use changePassword instead

        const user = await User.findByIdAndUpdate(userId, updates, { new: true });

        await AuditLog.log({
            action: 'USER_UPDATED',
            actorId: req.user.id,
            actorModel: 'User',
            targetType: 'user',
            targetId: userId,
            ip: req.ip
        });

        res.json({ success: true, data: user });

    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

/**
 * Delete user
 */
exports.deleteUser = async (req, res) => {
    try {
        const { userId } = req.params;

        const user = await User.findById(userId);
        if (user.role === 'admin') {
            return res.status(400).json({ success: false, message: 'Cannot delete admin' });
        }

        await User.findByIdAndDelete(userId);

        await AuditLog.log({
            action: 'USER_DELETED',
            actorId: req.user.id,
            actorModel: 'User',
            targetType: 'user',
            targetId: userId,
            details: `Deleted: ${user.username}`,
            ip: req.ip,
            severity: 'WARNING'
        });

        res.json({ success: true, message: 'User deleted' });

    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

/**
 * Get all students
 */
exports.getStudents = async (req, res) => {
    try {
        const { page = 1, limit = 20, search } = req.query;

        const query = {};
        if (search) {
            query.$or = [
                { regno: new RegExp(search, 'i') },
                { name: new RegExp(search, 'i') }
            ];
        }

        const students = await Student.find(query)
            .select('-refreshToken -password')
            .limit(limit)
            .skip((page - 1) * limit)
            .sort({ regno: 1 });

        const total = await Student.countDocuments(query);

        res.json({
            success: true,
            data: students,
            pagination: {
                page: parseInt(page),
                limit: parseInt(limit),
                total,
                pages: Math.ceil(total / limit)
            }
        });

    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

/**
 * Suspend student
 */
exports.suspendStudent = async (req, res) => {
    try {
        const { regno } = req.params;
        const { reason } = req.body;

        const student = await Student.findOneAndUpdate(
            { regno: regno.toUpperCase() },
            { isSuspended: true, suspendedReason: reason },
            { new: true }
        );

        await AuditLog.log({
            action: 'STUDENT_SUSPENDED',
            actorId: req.user.id,
            actorModel: 'User',
            targetType: 'student',
            targetId: student._id,
            details: reason || 'Suspended by admin',
            ip: req.ip,
            severity: 'WARNING'
        });

        res.json({ success: true, message: 'Student suspended' });

    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

/**
 * Activate student
 */
exports.activateStudent = async (req, res) => {
    try {
        const { regno } = req.params;

        const student = await Student.findOneAndUpdate(
            { regno: regno.toUpperCase() },
            { isSuspended: false, suspendedReason: null },
            { new: true }
        );

        await AuditLog.log({
            action: 'STUDENT_UNSUSPENDED',
            actorId: req.user.id,
            actorModel: 'User',
            targetType: 'student',
            targetId: student._id,
            ip: req.ip
        });

        res.json({ success: true, message: 'Student activated' });

    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

/**
 * Get audit logs
 */
exports.getAuditLogs = async (req, res) => {
    try {
        const { page = 1, limit = 50, action, severity } = req.query;

        const query = {};
        if (action) query.action = action;
        if (severity) query.severity = severity;

        const logs = await AuditLog.find(query)
            .limit(limit)
            .skip((page - 1) * limit)
            .sort({ createdAt: -1 });

        res.json({ success: true, data: logs });

    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

/**
 * Get statistics
 */
exports.getStats = async (req, res) => {
    try {
        const [totalStudents, totalUsers, totalResults, recentLogs] = await Promise.all([
            Student.countDocuments({ isActive: true }),
            User.countDocuments({ isActive: true }),
            Result.countDocuments({ isLatest: true }),
            AuditLog.countDocuments({ createdAt: { $gte: new Date(Date.now() - 24 * 60 * 60 * 1000) } })
        ]);

        res.json({
            success: true,
            data: {
                totalStudents,
                totalUsers,
                totalResults,
                logsLast24h: recentLogs
            }
        });

    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
