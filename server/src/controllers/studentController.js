/**
 * Student Controller
 * CRMS Backend
 */

const { Student, Result } = require('../models');
const config = require('../config/constants');

/**
 * Get own results (student only)
 */
exports.getOwnResults = async (req, res) => {
    try {
        const results = await Result.find({
            studentId: req.user.id,
            isLatest: true
        }).sort({ semester: 1 });

        // Calculate CGPA
        let totalCredits = 0;
        let totalPoints = 0;

        results.forEach(r => {
            totalPoints += r.sgpa * r.totalCredits;
            totalCredits += r.totalCredits;
        });

        const cgpa = totalCredits > 0 ? (totalPoints / totalCredits).toFixed(2) : 0;

        res.json({
            success: true,
            data: {
                results,
                cgpa: parseFloat(cgpa),
                totalSemesters: results.length
            }
        });

    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to fetch results' });
    }
};

/**
 * Get specific semester result
 */
exports.getSemesterResult = async (req, res) => {
    try {
        const { semester } = req.params;

        const result = await Result.findOne({
            studentId: req.user.id,
            semester: parseInt(semester),
            isLatest: true
        });

        if (!result) {
            return res.status(404).json({ success: false, message: 'Result not found' });
        }

        res.json({ success: true, data: result });

    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to fetch result' });
    }
};

/**
 * Get full transcript
 */
exports.getTranscript = async (req, res) => {
    try {
        const student = await Student.findById(req.user.id)
            .populate('departmentId')
            .populate('regulationId');

        const results = await Result.find({
            studentId: req.user.id,
            isLatest: true
        }).sort({ semester: 1 });

        // Calculate CGPA
        let totalCredits = 0;
        let totalPoints = 0;
        let totalBacklogs = 0;

        results.forEach(r => {
            totalPoints += r.sgpa * r.earnedCredits;
            totalCredits += r.earnedCredits;
            totalBacklogs += r.backlogs.length;
        });

        const cgpa = totalCredits > 0 ? (totalPoints / totalCredits).toFixed(2) : 0;

        res.json({
            success: true,
            data: {
                student: {
                    regno: student.regno,
                    name: student.name,
                    gender: student.gender,
                    department: student.departmentId?.name,
                    regulation: student.regulationId?.code,
                    batch: student.batchYear
                },
                semesters: results.map(r => ({
                    semester: r.semester,
                    academicYear: r.academicYear,
                    subjects: r.subjects,
                    sgpa: r.sgpa,
                    status: r.status,
                    totalCredits: r.totalCredits,
                    earnedCredits: r.earnedCredits,
                    backlogs: r.backlogs
                })),
                summary: {
                    cgpa: parseFloat(cgpa),
                    totalSemesters: results.length,
                    totalCreditsEarned: totalCredits,
                    totalBacklogs
                }
            }
        });

    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to generate transcript' });
    }
};

/**
 * Get any student's results (faculty/HOD/admin)
 */
exports.getStudentResults = async (req, res) => {
    try {
        const { regno } = req.params;

        const student = await Student.findOne({ regno: regno.toUpperCase() });

        if (!student) {
            return res.status(404).json({ success: false, message: 'Student not found' });
        }

        const results = await Result.find({
            studentId: student._id,
            isLatest: true
        }).sort({ semester: 1 });

        res.json({
            success: true,
            data: {
                student: {
                    regno: student.regno,
                    name: student.name,
                    currentSemester: student.currentSemester
                },
                results
            }
        });

    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to fetch results' });
    }
};
