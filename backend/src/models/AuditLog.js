/**
 * Audit Log Model
 * CRMS Backend
 * 
 * Immutable audit trail for all sensitive operations
 */

const mongoose = require('mongoose');

const auditLogSchema = new mongoose.Schema({
    action: {
        type: String,
        required: true,
        enum: [
            'LOGIN', 'LOGOUT', 'LOGIN_FAILED',
            'MARKS_ENTERED', 'MARKS_UPDATED', 'MARKS_LOCKED',
            'RESULT_VERIFIED', 'RESULT_PUBLISHED', 'RESULT_ROLLBACK',
            'USER_CREATED', 'USER_UPDATED', 'USER_DELETED',
            'STUDENT_SUSPENDED', 'STUDENT_UNSUSPENDED',
            'PASSWORD_CHANGED', 'ACCESS_DENIED',
            'SYSTEM_ERROR'
        ]
    },
    actorId: {
        type: mongoose.Schema.Types.ObjectId,
        refPath: 'actorModel'
    },
    actorModel: {
        type: String,
        enum: ['User', 'Student']
    },
    actorName: String,
    actorRole: String,
    targetType: {
        type: String,
        enum: ['user', 'student', 'marks', 'result', 'subject', 'system']
    },
    targetId: mongoose.Schema.Types.ObjectId,
    details: {
        type: String,
        maxlength: 500
    },
    metadata: {
        type: mongoose.Schema.Types.Mixed
    },
    ip: String,
    userAgent: String,
    severity: {
        type: String,
        enum: ['INFO', 'WARNING', 'CRITICAL'],
        default: 'INFO'
    }
}, {
    timestamps: { createdAt: true, updatedAt: false }
});

// Indexes
auditLogSchema.index({ createdAt: -1 });
auditLogSchema.index({ action: 1, createdAt: -1 });
auditLogSchema.index({ actorId: 1, createdAt: -1 });
auditLogSchema.index({ targetId: 1 });

// TTL index - keep logs for 5 years
auditLogSchema.index({ createdAt: 1 }, { expireAfterSeconds: 5 * 365 * 24 * 60 * 60 });

// Prevent all modifications
auditLogSchema.pre('save', function (next) {
    if (!this.isNew) {
        return next(new Error('Audit logs are immutable'));
    }
    next();
});

auditLogSchema.pre('findOneAndUpdate', function (next) {
    return next(new Error('Audit logs are immutable'));
});

auditLogSchema.pre('updateOne', function (next) {
    return next(new Error('Audit logs are immutable'));
});

auditLogSchema.pre('deleteOne', function (next) {
    return next(new Error('Audit logs cannot be deleted'));
});

auditLogSchema.pre('deleteMany', function (next) {
    return next(new Error('Audit logs cannot be deleted'));
});

// Static method to create log
auditLogSchema.statics.log = async function (data) {
    return this.create(data);
};

module.exports = mongoose.model('AuditLog', auditLogSchema);
