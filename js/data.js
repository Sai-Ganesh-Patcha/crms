// CRMS Data Module - Student Records, Faculty, and Authentication
const CRMS_DATA = {
    // Faculty Members
    faculty: [
        { id: 1, name: "Dr. K. S. N. Prasad", subject: "Data Structures", email: "ksnprasad@college.edu" },
        { id: 2, name: "K. Viswa Prasad", subject: "Database Systems", email: "kvprasad@college.edu" },
        { id: 3, name: "S. V. V. D. Venu Gopal", subject: "Computer Networks", email: "svvdvg@college.edu" },
        { id: 4, name: "A. Revathi", subject: "Operating Systems", email: "arevathi@college.edu" },
        { id: 5, name: "Dr. V. Venkata Supura", subject: "Software Engineering", email: "vvsupura@college.edu" }
    ],

    // Default Users
    users: [
        { username: "admin", password: "admin123", role: "admin", name: "System Administrator" },
        { username: "operator", password: "operator123", role: "operator", name: "Academic Operator" },
        { username: "hod", password: "hod123", role: "hod", name: "Dr. K. S. N. Prasad" },
        { username: "faculty1", password: "faculty123", role: "faculty", name: "K. Viswa Prasad", facultyId: 2 },
        { username: "faculty2", password: "faculty123", role: "faculty", name: "S. V. V. D. Venu Gopal", facultyId: 3 },
        { username: "faculty3", password: "faculty123", role: "faculty", name: "A. Revathi", facultyId: 4 },
        { username: "faculty4", password: "faculty123", role: "faculty", name: "Dr. V. Venkata Supura", facultyId: 5 }
    ],

    // Grade Points
    gradePoints: { "S": 10, "A": 9, "B": 8, "C": 7, "D": 6, "E": 5, "F": 0 },

    // Subject Full Names
    subjectNames: {
        "CE": "Communicative English", "LA&C": "Linear Algebra & Calculus", "CHEM": "Chemistry",
        "BCME": "Basic Civil & Mechanical Engg", "IP": "Introduction to Programming", "CE_LAB": "CE Lab",
        "CHEM_LAB": "Chemistry Lab", "C_LAB": "C Programming Lab", "EWS": "Communicative English Lab", "SPORTS": "Sports",
        "DEVC": "Differential Equations & Vector Calculus", "EP": "Engineering Physics", "BEEE": "Basic EEE",
        "EG": "Engineering Graphics", "DS": "Data Structures", "EP_LAB": "Physics Lab", "ITWS": "IT Workshop",
        "BEEE_LAB": "BEEE Lab", "DS_LAB": "DS Lab", "NCC/NSS": "NCC/NSS",
        "DMGT": "Discrete Maths & Game Theory", "UHV": "Universal Human Values", "IDS": "Intro to Data Science",
        "ADS/AA": "Advanced DS & Algorithm Analysis", "OOPJ": "OOP with Java", "IDS_LAB": "Data Science Lab",
        "OOPJ_LAB": "Java Lab", "PY_LAB": "Python Lab", "ES": "Environmental Science",
        "OT": "Optimization Techniques", "SMDS": "Statistical Methods for Data Science", "DE": "Data Engineering",
        "DBMS": "Database Management Systems", "DLCO": "Digital Logic & Computer Organization",
        "DE_LAB": "DE Lab", "DBMS_LAB": "DBMS Lab", "EDAP_LAB": "EDA with Python Lab", "DTI_LAB": "DTI Lab"
    }
};

// Initialize localStorage with default data if not exists
function initializeData() {
    if (!localStorage.getItem('crms_initialized')) {
        localStorage.setItem('crms_users', JSON.stringify(CRMS_DATA.users));
        localStorage.setItem('crms_faculty', JSON.stringify(CRMS_DATA.faculty));
        localStorage.setItem('crms_students', JSON.stringify(STUDENT_DATA));
        localStorage.setItem('crms_feedback', JSON.stringify([]));
        localStorage.setItem('crms_suspended', JSON.stringify([]));
        localStorage.setItem('crms_logs', JSON.stringify([]));
        localStorage.setItem('crms_initialized', 'true');
    }
}

// Get data helpers
function getUsers() { return JSON.parse(localStorage.getItem('crms_users') || '[]'); }
function getStudents() { return JSON.parse(localStorage.getItem('crms_students') || '[]'); }
function getFaculty() { return JSON.parse(localStorage.getItem('crms_faculty') || '[]'); }
function getFeedback() { return JSON.parse(localStorage.getItem('crms_feedback') || '[]'); }
function getSuspended() { return JSON.parse(localStorage.getItem('crms_suspended') || '[]'); }
function getLogs() { return JSON.parse(localStorage.getItem('crms_logs') || '[]'); }

// Save data helpers
function saveUsers(users) { localStorage.setItem('crms_users', JSON.stringify(users)); }
function saveStudents(students) { localStorage.setItem('crms_students', JSON.stringify(students)); }
function saveFaculty(faculty) { localStorage.setItem('crms_faculty', JSON.stringify(faculty)); }
function saveFeedback(feedback) { localStorage.setItem('crms_feedback', JSON.stringify(feedback)); }
function saveSuspended(suspended) { localStorage.setItem('crms_suspended', JSON.stringify(suspended)); }

// Add log entry
function addLog(action, details, user) {
    const logs = getLogs();
    logs.unshift({ timestamp: new Date().toISOString(), action, details, user: user || 'System' });
    if (logs.length > 500) logs.pop();
    localStorage.setItem('crms_logs', JSON.stringify(logs));
}

// Calculate CGPA
function calculateCGPA(student) {
    const semesters = student.semesters;
    let totalCredits = 0, totalPoints = 0;
    for (const sem in semesters) {
        const s = semesters[sem];
        if (s.sgpa && !isNaN(s.sgpa) && s.credits) {
            totalPoints += s.sgpa * s.credits;
            totalCredits += s.credits;
        }
    }
    return totalCredits > 0 ? (totalPoints / totalCredits).toFixed(2) : 0;
}

// Get performance status
function getPerformanceStatus(cgpa) {
    if (cgpa >= 9) return { text: 'Excellent', class: 'performance-excellent' };
    if (cgpa >= 8) return { text: 'Best', class: 'performance-best' };
    if (cgpa >= 7) return { text: 'Good', class: 'performance-good' };
    if (cgpa >= 6) return { text: 'Average', class: 'performance-average' };
    return { text: 'Poor', class: 'performance-poor' };
}

// Get student by regno
function getStudentByRegno(regno) {
    const students = getStudents();
    return students.find(s => s.regno === regno);
}

// Check if student is suspended
function isStudentSuspended(regno) {
    return getSuspended().includes(regno);
}

// Toggle suspension
function toggleSuspension(regno) {
    const suspended = getSuspended();
    const idx = suspended.indexOf(regno);
    if (idx > -1) suspended.splice(idx, 1);
    else suspended.push(regno);
    saveSuspended(suspended);
    return idx === -1;
}

// Get toppers (top 20)
function getToppers() {
    const students = getStudents().filter(s => s.name && s.name !== 'NaN');
    return students.map(s => ({ ...s, cgpa: parseFloat(calculateCGPA(s)) }))
        .filter(s => s.cgpa > 0)
        .sort((a, b) => b.cgpa - a.cgpa)
        .slice(0, 20);
}

// Get poor performers (bottom 10)
function getPoorPerformers() {
    const students = getStudents().filter(s => s.name && s.name !== 'NaN');
    return students.map(s => ({ ...s, cgpa: parseFloat(calculateCGPA(s)) }))
        .filter(s => s.cgpa > 0)
        .sort((a, b) => a.cgpa - b.cgpa)
        .slice(0, 10);
}

// Get backlogs by subject
function getBacklogsBySubject() {
    const students = getStudents();
    const backlogs = {};
    students.forEach(student => {
        if (!student.semesters) return;
        Object.values(student.semesters).forEach(sem => {
            if (!sem.subjects) return;
            Object.entries(sem.subjects).forEach(([subj, grade]) => {
                if (grade === 'F') {
                    if (!backlogs[subj]) backlogs[subj] = [];
                    if (!backlogs[subj].includes(student.regno)) backlogs[subj].push(student.regno);
                }
            });
        });
    });
    return backlogs;
}

// Get backlogs by student
function getBacklogsByStudent(regno) {
    const student = getStudentByRegno(regno);
    if (!student || !student.semesters) return [];
    const backlogs = [];
    Object.entries(student.semesters).forEach(([sem, data]) => {
        if (!data.subjects) return;
        Object.entries(data.subjects).forEach(([subj, grade]) => {
            if (grade === 'F') backlogs.push({ semester: sem, subject: subj });
        });
    });
    return backlogs;
}

// Get department statistics
function getDepartmentStats() {
    const students = getStudents().filter(s => s.name && s.name !== 'NaN');
    const total = students.length;
    let excellent = 0, best = 0, good = 0, average = 0, poor = 0, withBacklogs = 0;

    students.forEach(s => {
        const cgpa = parseFloat(calculateCGPA(s));
        if (cgpa >= 9) excellent++;
        else if (cgpa >= 8) best++;
        else if (cgpa >= 7) good++;
        else if (cgpa >= 6) average++;
        else if (cgpa > 0) poor++;

        if (getBacklogsByStudent(s.regno).length > 0) withBacklogs++;
    });

    return { total, excellent, best, good, average, poor, withBacklogs };
}

// Get faculty average feedback
function getFacultyAvgFeedback(facultyId) {
    const feedbacks = getFeedback().filter(f => f.facultyId === facultyId);
    if (feedbacks.length === 0) return { avg: 0, count: 0 };
    const ratingMap = { 'excellent': 5, 'good': 4, 'average': 3, 'below_average': 2, 'poor': 1 };
    const sum = feedbacks.reduce((acc, f) => acc + (ratingMap[f.rating] || 0), 0);
    return { avg: (sum / feedbacks.length).toFixed(1), count: feedbacks.length };
}
