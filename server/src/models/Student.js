/**
 * Student Model
 * CRMS Backend
 * 
 * Separate from User - students have different auth flow
 */

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const config = require('../config/constants');

const studentSchema = new mongoose.Schema({
    regno: {
        type: String,
        required: [true, 'Registration number is required'],
        unique: true,
        uppercase: true,
        trim: true,
        match: [/^\d{2}K\d{2}[A-Z]\d{4}$/i, 'Invalid registration number format']
    },
    name: {
        type: String,
        required: [true, 'Name is required'],
        trim: true,
        maxlength: [100, 'Name cannot exceed 100 characters']
    },
    gender: {
        type: String,
        enum: ['M', 'F', 'O'],
        required: true
    },
    email: {
        type: String,
        trim: true,
        lowercase: true,
        match: [/^\S+@\S+\.\S+$/, 'Invalid email format']
    },
    phone: {
        type: String,
        trim: true,
        match: [/^[6-9]\d{9}$/, 'Invalid phone number']
    },
    password: {
        type: String,
        select: false // Never return in queries
    },
    departmentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Department',
        required: true
    },
    regulationId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Regulation',
        required: true
    },
    batchYear: {
        type: Number,
        required: true,
        min: 2000,
        max: 2100
    },
    currentSemester: {
        type: Number,
        default: 1,
        min: 1,
        max: 8
    },
    isActive: {
        type: Boolean,
        default: true
    },
    isSuspended: {
        type: Boolean,
        default: false
    },
    suspendedReason: String,
    firstLogin: {
        type: Boolean,
        default: true // Forces password change on first login
    },
    lastLogin: Date,
    refreshToken: {
        type: String,
        select: false
    }
}, {
    timestamps: true
});

// Indexes
studentSchema.index({ regno: 1 });
studentSchema.index({ departmentId: 1, batchYear: 1 });
studentSchema.index({ regulationId: 1, currentSemester: 1 });

// Hash password before saving
studentSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();

    // Default password is regno for first login
    if (!this.password) {
        this.password = this.regno;
    }

    this.password = await bcrypt.hash(this.password, config.security.bcryptRounds);
    next();
});

// Verify password
studentSchema.methods.comparePassword = async function (candidatePassword) {
    return bcrypt.compare(candidatePassword, this.password);
};

// Computed CGPA (from published results only)
studentSchema.methods.getCGPA = async function () {
    const Result = mongoose.model('Result');
    const results = await Result.find({
        studentId: this._id,
        status: 'PUBLISHED'
    });

    if (results.length === 0) return 0;

    let totalCredits = 0;
    let totalPoints = 0;

    results.forEach(r => {
        totalPoints += r.sgpa * r.totalCredits;
        totalCredits += r.totalCredits;
    });

    return totalCredits > 0 ? (totalPoints / totalCredits).toFixed(2) : 0;
};

module.exports = mongoose.model('Student', studentSchema);
