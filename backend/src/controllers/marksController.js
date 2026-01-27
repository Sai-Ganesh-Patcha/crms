/**
 * Marks Controller
 * CRMS Backend
 */

const { Marks, Subject, Student, AuditLog } = require('../models');
const config = require('../config/constants');

/**
 * Enter marks for a student
 */
exports.enterMarks = async (req, res) => {
    try {
        const { studentId, subjectId, internalMarks, externalMarks, semester, academicYear } = req.body;

        // Check if marks already exist
        let marks = await Marks.findOne({ studentId, subjectId, semester, academicYear });

        if (marks) {
            if (marks.status !== config.resultStatus.DRAFT) {
                return res.status(400).json({
                    success: false,
                    message: 'Cannot modify locked marks'
                });
            }

            // Update existing
            marks.internalMarks = internalMarks;
            marks.externalMarks = externalMarks;
            marks.enteredBy = req.user.id;
            await marks.save();

            await AuditLog.log({
                action: 'MARKS_UPDATED',
                actorId: req.user.id,
                actorModel: 'User',
                actorName: req.user.name,
                actorRole: req.user.role,
                targetType: 'marks',
                targetId: marks._id,
                details: `Updated marks for student ${studentId}`,
                ip: req.ip
            });

        } else {
            // Create new
            marks = await Marks.create({
                studentId,
                subjectId,
                semester,
                academicYear,
                internalMarks,
                externalMarks,
                enteredBy: req.user.id,
                status: config.resultStatus.DRAFT
            });

            await AuditLog.log({
                action: 'MARKS_ENTERED',
                actorId: req.user.id,
                actorModel: 'User',
                actorName: req.user.name,
                actorRole: req.user.role,
                targetType: 'marks',
                targetId: marks._id,
                details: `Entered marks for student ${studentId}`,
                ip: req.ip
            });
        }

        res.json({ success: true, data: marks });

    } catch (error) {
        console.error('Enter marks error:', error);
        res.status(500).json({ success: false, message: error.message });
    }
};

/**
 * Update marks
 */
exports.updateMarks = async (req, res) => {
    try {
        const { markId } = req.params;
        const { internalMarks, externalMarks } = req.body;

        const marks = await Marks.findById(markId);

        if (!marks) {
            return res.status(404).json({ success: false, message: 'Marks not found' });
        }

        if (marks.status !== config.resultStatus.DRAFT) {
            return res.status(400).json({ success: false, message: 'Cannot modify locked marks' });
        }

        marks.internalMarks = internalMarks;
        marks.externalMarks = externalMarks;
        await marks.save();

        await AuditLog.log({
            action: 'MARKS_UPDATED',
            actorId: req.user.id,
            actorModel: 'User',
            targetType: 'marks',
            targetId: marks._id,
            ip: req.ip
        });

        res.json({ success: true, data: marks });

    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

/**
 * Lock marks (faculty confirms entry is complete)
 */
exports.lockMarks = async (req, res) => {
    try {
        const { subjectId, semester, academicYear } = req.body;

        // Find all draft marks for this subject
        const marks = await Marks.find({
            subjectId,
            semester,
            academicYear,
            status: config.resultStatus.DRAFT
        });

        if (marks.length === 0) {
            return res.status(400).json({
                success: false,
                message: 'No draft marks found to lock'
            });
        }

        // Validate all marks are complete
        const incomplete = marks.filter(m => m.internalMarks === null || m.externalMarks === null);
        if (incomplete.length > 0) {
            return res.status(400).json({
                success: false,
                message: `${incomplete.length} students have incomplete marks. Cannot lock.`,
                incomplete: incomplete.map(m => m.studentId)
            });
        }

        // Lock all marks
        const result = await Marks.updateMany(
            { subjectId, semester, academicYear, status: config.resultStatus.DRAFT },
            {
                $set: {
                    status: config.resultStatus.LOCKED,
                    lockedAt: new Date(),
                    lockedBy: req.user.id
                }
            }
        );

        await AuditLog.log({
            action: 'MARKS_LOCKED',
            actorId: req.user.id,
            actorModel: 'User',
            actorName: req.user.name,
            actorRole: req.user.role,
            targetType: 'subject',
            targetId: subjectId,
            details: `Locked ${result.modifiedCount} marks for semester ${semester}`,
            ip: req.ip
        });

        res.json({
            success: true,
            message: `${result.modifiedCount} marks locked successfully`
        });

    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

/**
 * Verify marks (HOD approval)
 */
exports.verifyMarks = async (req, res) => {
    try {
        const { subjectId, semester, academicYear } = req.body;

        const result = await Marks.updateMany(
            { subjectId, semester, academicYear, status: config.resultStatus.LOCKED },
            {
                $set: {
                    status: config.resultStatus.VERIFIED,
                    verifiedAt: new Date(),
                    verifiedBy: req.user.id
                }
            }
        );

        if (result.modifiedCount === 0) {
            return res.status(400).json({
                success: false,
                message: 'No locked marks found to verify'
            });
        }

        await AuditLog.log({
            action: 'RESULT_VERIFIED',
            actorId: req.user.id,
            actorModel: 'User',
            actorName: req.user.name,
            actorRole: req.user.role,
            targetType: 'subject',
            targetId: subjectId,
            details: `Verified ${result.modifiedCount} marks`,
            ip: req.ip
        });

        res.json({
            success: true,
            message: `${result.modifiedCount} marks verified`
        });

    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

/**
 * Get marks by subject
 */
exports.getMarksBySubject = async (req, res) => {
    try {
        const { subjectId, semester } = req.params;
        const { academicYear, status } = req.query;

        const query = { subjectId, semester: parseInt(semester) };
        if (academicYear) query.academicYear = academicYear;
        if (status) query.status = status;

        const marks = await Marks.find(query)
            .populate('studentId', 'regno name')
            .populate('subjectId', 'code name credits')
            .sort({ 'studentId.regno': 1 });

        res.json({ success: true, data: marks });

    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
