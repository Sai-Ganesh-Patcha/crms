/**
 * Result Model (IMMUTABLE)
 * CRMS Backend
 * 
 * Created on publish. INSERT ONLY - no updates allowed.
 * This is the official record.
 */

const mongoose = require('mongoose');

const resultSubjectSchema = new mongoose.Schema({
    subjectId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Subject',
        required: true
    },
    code: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    credits: {
        type: Number,
        required: true
    },
    internalMarks: Number,
    externalMarks: Number,
    totalMarks: Number,
    grade: {
        type: String,
        required: true
    },
    gradePoints: {
        type: Number,
        required: true
    }
}, { _id: false });

const resultSchema = new mongoose.Schema({
    studentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Student',
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
        required: true
    },
    regulationId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Regulation',
        required: true
    },
    subjects: [resultSubjectSchema],
    totalCredits: {
        type: Number,
        required: true
    },
    earnedCredits: {
        type: Number,
        required: true
    },
    totalGradePoints: {
        type: Number,
        required: true
    },
    sgpa: {
        type: Number,
        required: true,
        min: 0,
        max: 10
    },
    status: {
        type: String,
        enum: ['PASS', 'FAIL', 'DETAINED'],
        required: true
    },
    backlogs: [{
        subjectId: mongoose.Schema.Types.ObjectId,
        code: String,
        name: String
    }],
    publishedAt: {
        type: Date,
        default: Date.now,
        immutable: true
    },
    publishedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    version: {
        type: Number,
        default: 1
    },
    previousVersion: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Result',
        default: null
    },
    isLatest: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: { createdAt: true, updatedAt: false } // No updates
});

// Indexes
resultSchema.index({ studentId: 1, semester: 1, isLatest: 1 });
resultSchema.index({ publishedAt: -1 });
resultSchema.index({ academicYear: 1, semester: 1 });

// CRITICAL: Prevent all updates except isLatest flag
resultSchema.pre('save', function (next) {
    if (!this.isNew) {
        // Only allow updating isLatest for versioning
        const modifiedPaths = this.modifiedPaths();
        if (modifiedPaths.length > 1 || !modifiedPaths.includes('isLatest')) {
            return next(new Error('Results are immutable. Cannot modify published result.'));
        }
    }
    next();
});

// Prevent findOneAndUpdate
resultSchema.pre('findOneAndUpdate', function (next) {
    return next(new Error('Results are immutable. Use versioning for corrections.'));
});

// Prevent updateOne/updateMany
resultSchema.pre('updateOne', function (next) {
    return next(new Error('Results are immutable. Use versioning for corrections.'));
});

resultSchema.pre('updateMany', function (next) {
    return next(new Error('Results are immutable. Use versioning for corrections.'));
});

module.exports = mongoose.model('Result', resultSchema);
