/**
 * Department Model
 * CRMS Backend
 */

const mongoose = require('mongoose');

const departmentSchema = new mongoose.Schema({
    code: {
        type: String,
        required: true,
        unique: true,
        uppercase: true,
        trim: true,
        maxlength: 10
    },
    name: {
        type: String,
        required: true,
        trim: true,
        maxlength: 100
    },
    hodId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    isActive: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Department', departmentSchema);
