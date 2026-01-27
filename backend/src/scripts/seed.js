/**
 * Database Seed Script
 * CRMS Backend
 * 
 * Imports existing student data and creates initial users
 */

require('dotenv').config();

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const { User, Student, Department, Regulation, Subject } = require('../models');

// Sample data (you'll populate from your existing students1.js)
const seedData = {
    department: {
        code: 'CSD',
        name: 'Computer Science & Data Science'
    },

    regulation: {
        code: 'R23',
        name: 'Regulation 2023',
        effectiveFrom: 2023,
        gradeScale: {
            S: { points: 10, minMarks: 90 },
            A: { points: 9, minMarks: 80 },
            B: { points: 8, minMarks: 70 },
            C: { points: 7, minMarks: 60 },
            D: { points: 6, minMarks: 50 },
            E: { points: 5, minMarks: 40 },
            F: { points: 0, minMarks: 0 }
        },
        minPassGrade: 'E'
    },

    users: [
        { username: 'admin', password: 'admin@crms2024', name: 'System Administrator', role: 'admin' },
        { username: 'operator', password: 'operator@crms2024', name: 'Academic Operator', role: 'operator' },
        { username: 'hod', password: 'hod@crms2024', name: 'Dr. K. S. N. Prasad', role: 'hod' },
        { username: 'faculty1', password: 'faculty@2024', name: 'K. Viswa Prasad', role: 'faculty' },
        { username: 'faculty2', password: 'faculty@2024', name: 'S. V. V. D. Venu Gopal', role: 'faculty' },
        { username: 'faculty3', password: 'faculty@2024', name: 'A. Revathi', role: 'faculty' }
    ],

    subjects: [
        { code: 'CE', name: 'Communicative English', credits: 3, type: 'THEORY', semester: 1 },
        { code: 'LA&C', name: 'Linear Algebra & Calculus', credits: 4, type: 'THEORY', semester: 1 },
        { code: 'CHEM', name: 'Chemistry', credits: 3, type: 'THEORY', semester: 1 },
        { code: 'BCME', name: 'Basic Civil & Mechanical Engg', credits: 3, type: 'THEORY', semester: 1 },
        { code: 'IP', name: 'Introduction to Programming', credits: 3, type: 'THEORY', semester: 1 },
        { code: 'CHEM_LAB', name: 'Chemistry Lab', credits: 1.5, type: 'LAB', semester: 1 },
        { code: 'C_LAB', name: 'C Programming Lab', credits: 1.5, type: 'LAB', semester: 1 },
        // Semester 2
        { code: 'DEVC', name: 'Differential Equations & Vector Calculus', credits: 4, type: 'THEORY', semester: 2 },
        { code: 'EP', name: 'Engineering Physics', credits: 3, type: 'THEORY', semester: 2 },
        { code: 'BEEE', name: 'Basic EEE', credits: 3, type: 'THEORY', semester: 2 },
        { code: 'EG', name: 'Engineering Graphics', credits: 3, type: 'THEORY', semester: 2 },
        { code: 'DS', name: 'Data Structures', credits: 3, type: 'THEORY', semester: 2 },
        { code: 'EP_LAB', name: 'Physics Lab', credits: 1.5, type: 'LAB', semester: 2 },
        { code: 'DS_LAB', name: 'DS Lab', credits: 1.5, type: 'LAB', semester: 2 },
        // Semester 3
        { code: 'DMGT', name: 'Discrete Maths & Game Theory', credits: 3, type: 'THEORY', semester: 3 },
        { code: 'UHV', name: 'Universal Human Values', credits: 2, type: 'THEORY', semester: 3 },
        { code: 'IDS', name: 'Intro to Data Science', credits: 3, type: 'THEORY', semester: 3 },
        { code: 'ADS/AA', name: 'Advanced DS & Algorithm Analysis', credits: 3, type: 'THEORY', semester: 3 },
        { code: 'OOPJ', name: 'OOP with Java', credits: 3, type: 'THEORY', semester: 3 },
        { code: 'IDS_LAB', name: 'Data Science Lab', credits: 1.5, type: 'LAB', semester: 3 },
        { code: 'OOPJ_LAB', name: 'Java Lab', credits: 1.5, type: 'LAB', semester: 3 },
        // Semester 4
        { code: 'OT', name: 'Optimization Techniques', credits: 3, type: 'THEORY', semester: 4 },
        { code: 'SMDS', name: 'Statistical Methods for Data Science', credits: 3, type: 'THEORY', semester: 4 },
        { code: 'DE', name: 'Data Engineering', credits: 3, type: 'THEORY', semester: 4 },
        { code: 'DBMS', name: 'Database Management Systems', credits: 3, type: 'THEORY', semester: 4 },
        { code: 'DLCO', name: 'Digital Logic & Computer Organization', credits: 3, type: 'THEORY', semester: 4 },
        { code: 'DE_LAB', name: 'DE Lab', credits: 1.5, type: 'LAB', semester: 4 },
        { code: 'DBMS_LAB', name: 'DBMS Lab', credits: 1.5, type: 'LAB', semester: 4 }
    ]
};

async function seed() {
    try {
        // Connect to MongoDB
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✅ Connected to MongoDB');

        // Clear existing data
        console.log('🗑️  Clearing existing data...');
        await Promise.all([
            User.deleteMany({}),
            Student.deleteMany({}),
            Department.deleteMany({}),
            Regulation.deleteMany({}),
            Subject.deleteMany({})
        ]);

        // Create department
        console.log('🏢 Creating department...');
        const department = await Department.create(seedData.department);

        // Create regulation
        console.log('📋 Creating regulation...');
        const regulation = await Regulation.create(seedData.regulation);

        // Create users
        console.log('👥 Creating users...');
        const users = await Promise.all(
            seedData.users.map(u => User.create({ ...u, departmentId: department._id }))
        );
        console.log(`   Created ${users.length} users`);

        // Update HOD in department
        const hod = users.find(u => u.role === 'hod');
        department.hodId = hod._id;
        await department.save();

        // Create subjects
        console.log('📚 Creating subjects...');
        const subjects = await Promise.all(
            seedData.subjects.map(s => Subject.create({ ...s, regulationId: regulation._id }))
        );
        console.log(`   Created ${subjects.length} subjects`);

        // Create sample students
        console.log('🎓 Creating sample students...');
        const sampleStudents = [
            { regno: '23K61A4401', name: 'Acharla Blessy', gender: 'F' },
            { regno: '23K61A4402', name: 'Adigopula Sai Priyanka', gender: 'F' },
            { regno: '23K61A4403', name: 'Akula Shiva Sai', gender: 'M' },
            { regno: '23K61A4404', name: 'Alla Jahnavi', gender: 'F' },
            { regno: '23K61A4405', name: 'Aluguvelly Rahul', gender: 'M' }
        ];

        for (const s of sampleStudents) {
            await Student.create({
                ...s,
                email: `${s.regno.toLowerCase()}@student.college.edu`,
                departmentId: department._id,
                regulationId: regulation._id,
                batchYear: 2023,
                currentSemester: 4
            });
        }
        console.log(`   Created ${sampleStudents.length} sample students`);

        console.log(`
╔═══════════════════════════════════════════════════════╗
║   ✅ Database seeded successfully!                    ║
╠═══════════════════════════════════════════════════════╣
║   Admin: admin / admin@crms2024                       ║
║   HOD:   hod / hod@crms2024                           ║
║   Faculty: faculty1 / faculty@2024                    ║
║   Students: 23K61A4401 / 23K61A4401 (first login)     ║
╚═══════════════════════════════════════════════════════╝
        `);

        await mongoose.disconnect();
        process.exit(0);

    } catch (error) {
        console.error('❌ Seed failed:', error);
        process.exit(1);
    }
}

seed();
