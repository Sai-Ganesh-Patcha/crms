/**
 * Marks Model
 * CRMS Backend
 * 
 * Editable until locked. Used for marks entry by faculty.
 */

const mongoose = require('mongoose');
const config = require('../config/constants');

const marksSchema = new mongoose.Schema({
    studentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Student',
        required: true
    },
    subjectId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Subject',
        required: true
    },
    semester: {
        type: Number,
        required: true,
        min: 1,
        max: 8
    },
    academicYear: {
        type: String,
        required: true // e.g., "2024-25"
    },
    internalMarks: {
        type: Number,
        min: 0,
        max: 40,
        default: null
    },
    externalMarks: {
        type: Number,
        min: 0,
        max: 60,
        default: null
    },
    totalMarks: {
        type: Number,
        min: 0,
        max: 100
    },
    grade: {
        type: String,
        enum: ['S', 'A', 'B', 'C', 'D', 'E', 'F', null],
        default: null
    },
    gradePoints: {
        type: Number,
        min: 0,
        max: 10
    },
    status: {
        type: String,
        enum: Object.values(config.resultStatus),
        default: config.resultStatus.DRAFT
    },
    enteredBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    lockedAt: Date,
    lockedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    verifiedAt: Date,
    verifiedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
}, {
    timestamps: true
});

// Indexes
marksSchema.index({ studentId: 1, semester: 1, academicYear: 1 });
marksSchema.index({ subjectId: 1, semester: 1 });
marksSchema.index({ status: 1 });

// Calculate grade from marks
marksSchema.methods.calculateGrade = function () {
    if (this.internalMarks === null || this.externalMarks === null) {
        return null;
    }

    this.totalMarks = this.internalMarks + this.externalMarks;

    // Find grade based on total marks
    for (const [grade, data] of Object.entries(config.gradeScale)) {
        if (this.totalMarks >= data.minMarks) {
            this.grade = grade;
            this.gradePoints = data.points;
            return grade;
        }
    }

    this.grade = 'F';
    this.gradePoints = 0;
    return 'F';
};

// Pre-save: calculate grade
marksSchema.pre('save', function (next) {
    if (this.isModified('internalMarks') || this.isModified('externalMarks')) {
        this.calculateGrade();
    }
    next();
});

// Prevent modification after lock
marksSchema.pre('save', function (next) {
    if (this.status !== config.resultStatus.DRAFT && this.isModified('internalMarks')) {
        return next(new Error('Cannot modify marks after locking'));
    }
    if (this.status !== config.resultStatus.DRAFT && this.isModified('externalMarks')) {
        return next(new Error('Cannot modify marks after locking'));
    }
    next();
});

module.exports = mongoose.model('Marks', marksSchema);
