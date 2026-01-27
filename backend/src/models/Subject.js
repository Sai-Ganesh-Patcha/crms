/**
 * Subject Model
 * CRMS Backend
 */

const mongoose = require('mongoose');

const subjectSchema = new mongoose.Schema({
    code: {
        type: String,
        required: [true, 'Subject code is required'],
        uppercase: true,
        trim: true,
        maxlength: 20
    },
    name: {
        type: String,
        required: [true, 'Subject name is required'],
        trim: true,
        maxlength: 100
    },
    credits: {
        type: Number,
        required: true,
        min: 0,
        max: 10
    },
    type: {
        type: String,
        enum: ['THEORY', 'LAB', 'PROJECT', 'ELECTIVE'],
        required: true
    },
    regulationId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Regulation',
        required: true
    },
    semester: {
        type: Number,
        required: true,
        min: 1,
        max: 8
    },
    maxInternal: {
        type: Number,
        default: 40
    },
    maxExternal: {
        type: Number,
        default: 60
    },
    isActive: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
});

// Compound index for unique subject per regulation+semester
subjectSchema.index({ code: 1, regulationId: 1, semester: 1 }, { unique: true });
subjectSchema.index({ regulationId: 1, semester: 1 });

module.exports = mongoose.model('Subject', subjectSchema);
