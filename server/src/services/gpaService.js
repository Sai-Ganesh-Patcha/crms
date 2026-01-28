/**
 * GPA Calculation Service
 * CRMS Backend
 * 
 * Pure, tested functions for grade computation
 */

const config = require('../config/constants');

/**
 * Calculate grade from total marks
 * @param {number} total - Total marks (0-100)
 * @returns {object} - { grade, points }
 */
function calculateGrade(total) {
    if (total === null || total === undefined || isNaN(total)) {
        return { grade: null, points: null };
    }

    for (const [grade, data] of Object.entries(config.gradeScale)) {
        if (total >= data.minMarks) {
            return { grade, points: data.points };
        }
    }

    return { grade: 'F', points: 0 };
}

/**
 * Calculate SGPA from subjects
 * @param {Array} subjects - Array of { credits, gradePoints }
 * @returns {number} - SGPA (0-10)
 */
function calculateSGPA(subjects) {
    if (!subjects || subjects.length === 0) return 0;

    let totalCredits = 0;
    let earnedCredits = 0;
    let totalGradePoints = 0;

    subjects.forEach(s => {
        totalCredits += s.credits;
        if (s.grade !== 'F') {
            earnedCredits += s.credits;
            totalGradePoints += s.gradePoints * s.credits;
        }
    });

    if (earnedCredits === 0) return 0;
    return parseFloat((totalGradePoints / earnedCredits).toFixed(2));
}

/**
 * Calculate CGPA from multiple semesters
 * @param {Array} semesters - Array of { sgpa, earnedCredits }
 * @returns {number} - CGPA (0-10)
 */
function calculateCGPA(semesters) {
    if (!semesters || semesters.length === 0) return 0;

    let totalCredits = 0;
    let totalPoints = 0;

    semesters.forEach(s => {
        if (s.sgpa && s.earnedCredits) {
            totalPoints += s.sgpa * s.earnedCredits;
            totalCredits += s.earnedCredits;
        }
    });

    if (totalCredits === 0) return 0;
    return parseFloat((totalPoints / totalCredits).toFixed(2));
}

/**
 * Determine result status
 * @param {Array} subjects - Array with grades
 * @returns {string} - 'PASS' | 'FAIL'
 */
function determineStatus(subjects) {
    const hasFailure = subjects.some(s => s.grade === 'F');
    return hasFailure ? 'FAIL' : 'PASS';
}

/**
 * Get performance category
 * @param {number} cgpa - CGPA value
 * @returns {object} - { text, level }
 */
function getPerformanceCategory(cgpa) {
    if (cgpa >= 9) return { text: 'Excellent', level: 5 };
    if (cgpa >= 8) return { text: 'Very Good', level: 4 };
    if (cgpa >= 7) return { text: 'Good', level: 3 };
    if (cgpa >= 6) return { text: 'Average', level: 2 };
    if (cgpa >= 5) return { text: 'Pass', level: 1 };
    return { text: 'Fail', level: 0 };
}

module.exports = {
    calculateGrade,
    calculateSGPA,
    calculateCGPA,
    determineStatus,
    getPerformanceCategory
};
