/**
 * CRMS Authentication Module
 * Department of Computer Science & Data Science
 * 
 * Handles user authentication, session management, and access control.
 * Integrates with Security module for password hashing and validation.
 * 
 * @version 2.0.0
 * @author CSD Department
 */

const Auth = {

    // ========================
    // Session Management
    // ========================

    /**
     * Check if user is logged in with valid session
     * @returns {boolean}
     */
    isLoggedIn() {
        const session = localStorage.getItem('crms_session');
        if (!session) return false;

        try {
            const parsed = JSON.parse(session);

            // Check session expiry
            if (Security.isSessionExpired(parsed.loginTime)) {
                this.logout(true); // Silent logout
                return false;
            }

            return true;
        } catch {
            return false;
        }
    },

    /**
     * Get current logged in user
     * @returns {object|null}
     */
    getCurrentUser() {
        const session = localStorage.getItem('crms_session');
        if (!session) return null;

        try {
            const parsed = JSON.parse(session);

            // Check session expiry
            if (Security.isSessionExpired(parsed.loginTime)) {
                this.logout(true);
                return null;
            }

            return parsed;
        } catch {
            return null;
        }
    },

    // ========================
    // Authentication
    // ========================

    /**
     * Authenticate user with role validation
     * 
     * @param {string} username - Username or registration number
     * @param {string} password - Password
     * @param {string} selectedRole - Role selected on login form
     * @returns {object} - { success: boolean, user?: object, error?: string, requiresPasswordChange?: boolean }
     */
    login(username, password, selectedRole) {
        // Input validation
        if (!username || !password || !selectedRole) {
            return { success: false, error: 'All fields are required' };
        }

        // Sanitize inputs
        username = Security.sanitizeInput(username.trim());

        // Check account lockout
        const lockStatus = Security.checkAccountLock(username);
        if (lockStatus.locked) {
            Security.auditLog('LOGIN_BLOCKED', `Account locked: ${username}`, username, 'WARNING');
            return {
                success: false,
                error: `Account temporarily locked. Try again in ${lockStatus.remainingMinutes} minutes.`
            };
        }

        initializeData();
        const users = getUsers();
        const students = getStudents();

        // ========================
        // Student Authentication
        // ========================
        if (selectedRole === 'student') {
            // Validate registration number format
            if (!Security.isValidRegno(username)) {
                Security.recordFailedAttempt(username);
                return { success: false, error: 'Invalid registration number format' };
            }

            const student = students.find(s => s.regno === username);

            if (!student) {
                Security.recordFailedAttempt(username);
                Security.auditLog('LOGIN_FAILED', `Student not found: ${username}`, username, 'WARNING');
                return { success: false, error: 'Invalid credentials' };
            }

            // Check suspension status
            if (isStudentSuspended(username)) {
                Security.auditLog('LOGIN_BLOCKED', `Suspended student attempted login: ${username}`, username, 'WARNING');
                return { success: false, error: 'Your account has been suspended. Contact HOD.' };
            }

            // Check if first login (password = regno) or existing password
            const storedPassword = student.passwordHash || username; // Default: regno as password
            let passwordValid = false;

            if (student.passwordHash) {
                // Verify against stored hash
                passwordValid = Security.verifyPassword(password, storedPassword);
            } else {
                // First login: password should equal regno
                passwordValid = (password === username);
            }

            if (!passwordValid) {
                Security.recordFailedAttempt(username);
                Security.auditLog('LOGIN_FAILED', `Invalid password: ${username}`, username, 'WARNING');
                return { success: false, error: 'Invalid credentials' };
            }

            // Clear failed attempts on success
            Security.clearLoginAttempts(username);

            // Check if password change required (first login)
            const requiresChange = Security.requiresPasswordChange(username);

            // Create session
            const session = {
                username: student.regno,
                name: student.name,
                role: 'student',
                regno: student.regno,
                loginTime: new Date().toISOString(),
                sessionId: Security.generateSessionToken()
            };

            localStorage.setItem('crms_session', JSON.stringify(session));
            Security.auditLog('LOGIN_SUCCESS', `Student logged in: ${student.name}`, student.name, 'INFO');

            return {
                success: true,
                user: session,
                requiresPasswordChange: requiresChange
            };
        }

        // ========================
        // Faculty/HOD/Admin Authentication
        // ========================
        const user = users.find(u => u.username === username);

        if (!user) {
            Security.recordFailedAttempt(username);
            Security.auditLog('LOGIN_FAILED', `User not found: ${username}`, username, 'WARNING');
            return { success: false, error: 'Invalid credentials' };
        }

        // Validate role matches
        if (user.role !== selectedRole) {
            Security.recordFailedAttempt(username);
            Security.auditLog('LOGIN_FAILED', `Role mismatch for: ${username} (expected: ${user.role}, got: ${selectedRole})`, username, 'WARNING');
            return {
                success: false,
                error: `Invalid credentials for ${selectedRole.toUpperCase()}`
            };
        }

        // Verify password
        let passwordValid = false;

        if (user.passwordHash) {
            passwordValid = Security.verifyPassword(password, user.passwordHash);
        } else {
            // Legacy: plain text password
            passwordValid = (user.password === password);
        }

        if (!passwordValid) {
            Security.recordFailedAttempt(username);
            Security.auditLog('LOGIN_FAILED', `Invalid password for: ${username}`, username, 'WARNING');
            return { success: false, error: 'Invalid credentials' };
        }

        // Clear failed attempts on success
        Security.clearLoginAttempts(username);

        // Create session
        const session = {
            username: user.username,
            name: user.name,
            role: user.role,
            loginTime: new Date().toISOString(),
            sessionId: Security.generateSessionToken()
        };

        localStorage.setItem('crms_session', JSON.stringify(session));
        Security.auditLog('LOGIN_SUCCESS', `${user.role} logged in: ${user.name}`, user.name, 'INFO');

        return { success: true, user: session };
    },

    /**
     * Logout current user
     * @param {boolean} silent - If true, don't redirect
     */
    logout(silent = false) {
        const user = this.getCurrentUser();

        if (user) {
            Security.auditLog('LOGOUT', `${user.role} logged out: ${user.name}`, user.name, 'INFO');
        }

        localStorage.removeItem('crms_session');

        if (!silent) {
            window.location.href = 'login.html';
        }
    },

    // ========================
    // Password Management
    // ========================

    /**
     * Change password for current user
     * 
     * @param {string} currentPassword - Current password
     * @param {string} newPassword - New password
     * @returns {object} - { success: boolean, error?: string }
     */
    changePassword(currentPassword, newPassword) {
        const currentUser = this.getCurrentUser();
        if (!currentUser) {
            return { success: false, error: 'Not logged in' };
        }

        // Validate new password strength
        const validation = Security.validatePassword(newPassword);
        if (!validation.valid) {
            return { success: false, error: validation.message };
        }

        if (currentUser.role === 'student') {
            // Student password change
            const students = getStudents();
            const idx = students.findIndex(s => s.regno === currentUser.regno);

            if (idx === -1) {
                return { success: false, error: 'Student not found' };
            }

            // Verify current password
            const student = students[idx];
            let currentValid = false;

            if (student.passwordHash) {
                currentValid = Security.verifyPassword(currentPassword, student.passwordHash);
            } else {
                currentValid = (currentPassword === student.regno); // First login
            }

            if (!currentValid) {
                return { success: false, error: 'Current password is incorrect' };
            }

            // Hash and save new password
            students[idx].passwordHash = Security.hashPasswordSync(newPassword);
            delete students[idx].password; // Remove legacy plain text if exists
            saveStudents(students);

            // Mark password as changed
            Security.markPasswordChanged(currentUser.username);
            Security.auditLog('PASSWORD_CHANGE', `Student changed password: ${currentUser.name}`, currentUser.name, 'INFO');

            return { success: true };
        } else {
            // Faculty/HOD/Admin password change
            const users = getUsers();
            const idx = users.findIndex(u => u.username === currentUser.username);

            if (idx === -1) {
                return { success: false, error: 'User not found' };
            }

            // Verify current password
            const user = users[idx];
            let currentValid = false;

            if (user.passwordHash) {
                currentValid = Security.verifyPassword(currentPassword, user.passwordHash);
            } else {
                currentValid = (user.password === currentPassword);
            }

            if (!currentValid) {
                return { success: false, error: 'Current password is incorrect' };
            }

            // Hash and save new password
            users[idx].passwordHash = Security.hashPasswordSync(newPassword);
            delete users[idx].password; // Remove legacy plain text
            saveUsers(users);

            Security.auditLog('PASSWORD_CHANGE', `User changed password: ${currentUser.name}`, currentUser.name, 'INFO');

            return { success: true };
        }
    },

    // ========================
    // Access Control
    // ========================

    /**
     * Check if current user has specified role
     * 
     * @param {string|string[]} requiredRole - Required role(s)
     * @returns {boolean}
     */
    hasRole(requiredRole) {
        const user = this.getCurrentUser();
        if (!user) return false;

        if (Array.isArray(requiredRole)) {
            return requiredRole.includes(user.role);
        }
        return user.role === requiredRole;
    },

    /**
     * Protect a page - redirect if not authorized
     * 
     * @param {string|string[]} allowedRoles - Allowed role(s) for this page
     * @returns {boolean} - True if access granted
     */
    requireAuth(allowedRoles) {
        if (!this.isLoggedIn()) {
            Security.auditLog('ACCESS_DENIED', 'Unauthenticated access attempt', 'ANONYMOUS', 'WARNING');
            window.location.href = 'login.html';
            return false;
        }

        if (allowedRoles && !this.hasRole(allowedRoles)) {
            const user = this.getCurrentUser();
            Security.auditLog('ACCESS_DENIED', `Unauthorized role: ${user?.role} tried to access ${allowedRoles}`, user?.name || 'UNKNOWN', 'WARNING');
            alert('Access denied. You do not have permission to view this page.');
            this.logout();
            return false;
        }

        return true;
    },

    // ========================
    // Session Utilities
    // ========================

    /**
     * Get session remaining time in minutes
     * @returns {number}
     */
    getSessionRemainingMinutes() {
        const user = this.getCurrentUser();
        if (!user) return 0;
        return Security.getSessionRemainingMinutes(user.loginTime);
    },

    /**
     * Extend session (refresh login time)
     */
    refreshSession() {
        const session = localStorage.getItem('crms_session');
        if (!session) return;

        try {
            const parsed = JSON.parse(session);
            parsed.loginTime = new Date().toISOString();
            localStorage.setItem('crms_session', JSON.stringify(parsed));
        } catch {
            // Invalid session
        }
    }
};

// ========================
// Global Event Listeners
// ========================

// Check session validity on page load
window.addEventListener('load', function () {
    if (!localStorage.getItem('crms_initialized')) {
        localStorage.removeItem('crms_session');
    }
});

// Auto-logout on storage clear from another tab
window.addEventListener('storage', function (e) {
    if (e.key === null || e.key === 'crms_session') {
        if (!localStorage.getItem('crms_session') && !window.location.href.includes('login.html')) {
            window.location.href = 'login.html';
        }
    }
});

// Session activity monitoring - refresh on user activity
let activityTimeout;
function resetActivityTimer() {
    clearTimeout(activityTimeout);
    activityTimeout = setTimeout(function () {
        if (Auth.isLoggedIn()) {
            Auth.refreshSession();
        }
    }, 60000); // Refresh session every minute of activity
}

// Monitor user activity
['click', 'keypress', 'scroll', 'mousemove'].forEach(function (event) {
    document.addEventListener(event, resetActivityTimer, { passive: true });
});
