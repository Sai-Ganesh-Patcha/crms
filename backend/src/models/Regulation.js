/**
 * Regulation Model
 * CRMS Backend
 */

const mongoose = require('mongoose');

const regulationSchema = new mongoose.Schema({
    code: {
        type: String,
        required: true,
        unique: true,
        uppercase: true,
        trim: true // e.g., "R23"
    },
    name: {
        type: String,
        required: true,
        trim: true
    },
    effectiveFrom: {
        type: Number, // Year
        required: true
    },
    gradeScale: {
        type: Map,
        of: new mongoose.Schema({
            points: { type: Number, required: true },
            minMarks: { type: Number, required: true }
        }, { _id: false }),
        required: true
    },
    minPassGrade: {
        type: String,
        default: 'E'
    },
    minPassMarks: {
        type: Number,
        default: 40
    },
    isActive: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Regulation', regulationSchema);
