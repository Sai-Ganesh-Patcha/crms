/**
 * Student Data Seeding Script
 * Transforms frontend mock data into backend schema
 */

const mongoose = require('mongoose');
const path = require('path');
const { Student, Department, Regulation, Subject, Marks } = require('../models');

// Grade to marks mapping (approximate)
const GRADE_TO_MARKS = {
    'S': { internal: 40, external: 60 },
    'A': { internal: 36, external: 54 },
    'B': { internal: 32, external: 48 },
    'C': { internal: 28, external: 42 },
    'D': { internal: 24, external: 36 },
    'E': { internal: 20, external: 30 },
    'F': { internal: 0, external: 0 }
};

async function seedStudents() {
    try {
        // Load student data
        const STUDENT_DATA = require('../data/studentData');

        console.log(`📚 Loading ${STUDENT_DATA.length} students...`);

        // Find or create default department
        let department = await Department.findOne({ code: 'CSE' });
        if (!department) {
            department = await Department.create({
                code: 'CSE',
                name: 'Computer Science & Engineering',
                hod: null
            });
            console.log('✅ Created CSE department');
        }

        // Find or create regulation
        let regulation = await Regulation.findOne({ code: 'R23' });
        if (!regulation) {
            regulation = await Regulation.create({
                code: 'R23',
                name: 'R23 Regulation',
                startYear: 2023,
                totalSemesters: 8
            });
            console.log('✅ Created R23 regulation');
        }

        // Subject mapping cache
        const subjectCache = {};

        async function getOrCreateSubject(code, semesterNum) {
            if (subjectCache[code]) return subjectCache[code];

            let subject = await Subject.findOne({ code });
            if (!subject) {
                const isLab = code.includes('_LAB') || code === 'SPORTS' || code === 'NCC/NSS';
                subject = await Subject.create({
                    code,
                    name: code.replace(/_/g, ' '),
                    credits: isLab ? 1 : 3,
                    type: isLab ? 'LAB' : 'THEORY',
                    semester: semesterNum,
                    departmentId: department._id,
                    regulationId: regulation._id
                });
            }
            subjectCache[code] = subject;
            return subject;
        }

        let successCount = 0;
        let errorCount = 0;

        for (const studentData of STUDENT_DATA) {
            try {
                // Extract batch year from regno (e.g., "23K61A4401" -> 2023)
                const batchYear = 2000 + parseInt(studentData.regno.substring(0, 2));

                // Create or update student
                let student = await Student.findOne({ regno: studentData.regno });
                if (!student) {
                    student = await Student.create({
                        regno: studentData.regno,
                        name: studentData.name,
                        gender: studentData.gender || 'M',
                        email: studentData.email || `${studentData.regno.toLowerCase()}@example.com`,
                        phone: studentData.phone || '',
                        password: studentData.regno, // Will be hashed by pre-save hook
                        departmentId: department._id,
                        regulationId: regulation._id,
                        batchYear,
                        currentSemester: Object.keys(studentData.semesters || {}).length,
                        isActive: true,
                        firstLogin: true
                    });
                }

                // Clear existing marks for this student
                await Marks.deleteMany({ studentId: student._id });

                // Process semesters
                const semesters = studentData.semesters || {};
                for (const [semKey, semData] of Object.entries(semesters)) {
                    const semesterNum = parseInt(semKey.replace('sem', ''));
                    const subjects = semData.subjects || {};

                    for (const [subjectCode, grade] of Object.entries(subjects)) {
                        const subject = await getOrCreateSubject(subjectCode, semesterNum);
                        const marks = GRADE_TO_MARKS[grade] || { internal: 0, external: 0 };

                        await Marks.create({
                            studentId: student._id,
                            subjectId: subject._id,
                            semester: semesterNum,
                            academicYear: `${batchYear}-${batchYear + 1}`,
                            internalMarks: marks.internal,
                            externalMarks: marks.external,
                            grade,
                            status: 'PUBLISHED',
                            enteredBy: null // System import
                        });
                    }
                }

                successCount++;
                console.log(`✅ [${successCount}/${STUDENT_DATA.length}] ${student.regno} - ${student.name}`);

            } catch (err) {
                errorCount++;
                console.error(`❌ Error processing ${studentData.regno}:`, err.message);
            }
        }

        console.log(`\n🎉 Seeding completed!`);
        console.log(`✅ Success: ${successCount}`);
        console.log(`❌ Errors: ${errorCount}`);

        return { success: successCount, errors: errorCount };

    } catch (error) {
        console.error('❌ Seeding failed:', error);
        throw error;
    }
}

module.exports = seedStudents;
