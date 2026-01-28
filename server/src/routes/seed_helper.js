const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const { User } = require('../models');

// EMERGENCY USER CREATION ROUTE
router.get('/trigger-seed-db-secure-key-123', async (req, res) => {
    try {
        console.log('🚨 EMERGENCY: Triggering single user creation...');

        if (mongoose.connection.readyState !== 1) {
            return res.status(500).json({ success: false, message: 'Database not connected' });
        }

        // 1. Delete existing admin
        await User.deleteOne({ username: 'admin' });

        // 2. Create fresh admin user (PASS PLAIN TEXT PASSWORD - Mongoose hook matches it)
        const newAdmin = await User.create({
            username: 'admin',
            password: '123456', // Plain password - model will hash it
            name: 'Emergency Admin',
            role: 'admin',
            email: 'admin@emergency.com'
        });

        console.log('✅ Admin user created:', newAdmin);

        res.json({
            success: true,
            message: 'User created successfully! Try logging in now.',
            credentials: {
                role: 'Administrator', // UI text
                username: 'admin',
                password: '123456'
            },
            instruction: 'Go to Login Page -> Select "Administrator" -> Use these credentials.'
        });

    } catch (error) {
        console.error('❌ Creation failed:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

/**
 * Seed Custom Student Data
 * URL: /api/system/seed-students-secure-key-456
 */
router.get('/seed-students-secure-key-456', async (req, res) => {
    try {
        console.log('📚 Student data seeding triggered...');

        const seedStudents = require('../scripts/seedStudents');
        const result = await seedStudents();

        res.json({
            success: true,
            message: 'Student data seeded successfully',
            data: result
        });

    } catch (error) {
        console.error('❌ Student seeding error:', error);
        res.status(500).json({
            success: false,
            message: 'Student seeding failed',
            error: error.message
        });
    }
});

module.exports = router;
