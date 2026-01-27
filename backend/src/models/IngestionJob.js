/**
 * Ingestion Job Model
 * CRMS Backend
 * 
 * Tracks bulk data import jobs from various file formats
 */

const mongoose = require('mongoose');

const validationErrorSchema = new mongoose.Schema({
    row: Number,
    field: String,
    value: mongoose.Schema.Types.Mixed,
    message: String,
    severity: {
        type: String,
        enum: ['ERROR', 'WARNING'],
        default: 'ERROR'
    }
}, { _id: false });

const ingestionJobSchema = new mongoose.Schema({
    fileName: {
        type: String,
        required: true
    },
    originalName: String,
    fileType: {
        type: String,
        enum: ['json', 'csv', 'xlsx', 'pdf', 'doc', 'docx', 'image'],
        required: true
    },
    fileSize: {
        type: Number,
        max: 50 * 1024 * 1024 // 50MB limit
    },
    filePath: String,

    uploadedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },

    targetEntity: {
        type: String,
        enum: ['students', 'faculty', 'subjects', 'marks', 'semesters'],
        required: true
    },

    status: {
        type: String,
        enum: ['UPLOADED', 'PROCESSING', 'EXTRACTED', 'VALIDATED', 'PREVIEW_READY', 'COMMITTED', 'FAILED', 'CANCELLED'],
        default: 'UPLOADED'
    },

    // Extracted data (temporary storage before commit)
    extractedData: [{
        type: mongoose.Schema.Types.Mixed
    }],

    extractedCount: {
        type: Number,
        default: 0
    },

    // Validation results
    validationErrors: [validationErrorSchema],
    validationWarnings: [validationErrorSchema],

    // Conflict detection
    conflicts: [{
        existingId: mongoose.Schema.Types.ObjectId,
        existingData: mongoose.Schema.Types.Mixed,
        newData: mongoose.Schema.Types.Mixed,
        resolution: {
            type: String,
            enum: ['PENDING', 'SKIP', 'MERGE', 'OVERWRITE'],
            default: 'PENDING'
        }
    }],

    // Processing metadata
    processingStartedAt: Date,
    processingCompletedAt: Date,
    processingError: String,

    // AI extraction confidence (for PDF/images)
    aiConfidence: {
        type: Number,
        min: 0,
        max: 1
    },
    aiRequiresReview: {
        type: Boolean,
        default: false
    },

    // Preview approval
    previewApproved: {
        type: Boolean,
        default: false
    },
    previewApprovedAt: Date,
    previewApprovedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },

    // Commit details
    committedAt: Date,
    committedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    commitResult: {
        created: { type: Number, default: 0 },
        updated: { type: Number, default: 0 },
        skipped: { type: Number, default: 0 },
        failed: { type: Number, default: 0 }
    },

    // Audit reference
    auditId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'AuditLog'
    }
}, {
    timestamps: true
});

// Indexes
ingestionJobSchema.index({ uploadedBy: 1, createdAt: -1 });
ingestionJobSchema.index({ status: 1 });
ingestionJobSchema.index({ targetEntity: 1, status: 1 });

// Cannot modify after commit
ingestionJobSchema.pre('save', function (next) {
    if (!this.isNew && this.isModified('extractedData')) {
        if (this.status === 'COMMITTED') {
            return next(new Error('Cannot modify committed ingestion job'));
        }
    }
    next();
});

module.exports = mongoose.model('IngestionJob', ingestionJobSchema);
