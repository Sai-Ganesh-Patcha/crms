/**
 * CRMS Security Utilities
 * Department of Computer Science & Data Science
 * 
 * This module provides security functions for the College Result Management System.
 * Implements password hashing, session security, and input validation.
 * 
 * @version 1.0.0
 * @author CSD Department
 */

const Security = {

    // ========================
    // Configuration Constants
    // ========================

    CONFIG: {
        SESSION_TIMEOUT_MS: 2 * 60 * 60 * 1000,  // 2 hours
        PASSWORD_MIN_LENGTH: 6,
        PASSWORD_MAX_LENGTH: 128,
        MAX_LOGIN_ATTEMPTS: 5,
        LOCKOUT_DURATION_MS: 15 * 60 * 1000,    // 15 minutes
        HASH_ITERATIONS: 1000,
        SALT_PREFIX: 'CRMS_CSD_2024_'
    },

    // ========================
    // Password Hashing
    // ========================

    /**
     * Generate SHA-256 hash of a password with salt
     * Uses Web Crypto API for secure hashing
     * 
     * @param {string} password - Plain text password
     * @returns {Promise<string>} - Hashed password as hex string
     */
    async hashPassword(password) {
        const salted = this.CONFIG.SALT_PREFIX + password;
        const encoder = new TextEncoder();
        const data = encoder.encode(salted);

        // Use Web Crypto API for SHA-256
        const hashBuffer = await crypto.subtle.digest('SHA-256', data);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');

        return hashHex;
    },

    /**
     * Synchronous password hash for compatibility
     * Uses a simple but effective hash for client-side use
     * 
     * @param {string} password - Plain text password
     * @returns {string} - Hashed password
     */
    hashPasswordSync(password) {
        const salted = this.CONFIG.SALT_PREFIX + password;
        let hash = 0;

        for (let i = 0; i < salted.length; i++) {
            const char = salted.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash; // Convert to 32-bit integer
        }

        // Create a more complex hash using multiple rounds
        let result = Math.abs(hash).toString(16);
        for (let round = 0; round < 3; round++) {
            let roundHash = 0;
            const roundInput = result + salted + round;
            for (let i = 0; i < roundInput.length; i++) {
                roundHash = ((roundHash << 5) - roundHash) + roundInput.charCodeAt(i);
                roundHash = roundHash & roundHash;
            }
            result = Math.abs(roundHash).toString(16) + result;
        }

        return result.substring(0, 64); // Return 64 char hash
    },

    /**
     * Verify password against stored hash
     * 
     * @param {string} password - Plain text password to verify
     * @param {string} storedHash - Previously stored hash
     * @returns {boolean} - True if password matches
     */
    verifyPassword(password, storedHash) {
        const computedHash = this.hashPasswordSync(password);
        return computedHash === storedHash;
    },

    // ========================
    // Session Security
    // ========================

    /**
     * Create a secure session token
     * 
     * @returns {string} - Random session token
     */
    generateSessionToken() {
        const array = new Uint8Array(32);
        crypto.getRandomValues(array);
        return Array.from(array, b => b.toString(16).padStart(2, '0')).join('');
    },

    /**
     * Check if session has expired
     * 
     * @param {string} loginTime - ISO timestamp of login
     * @returns {boolean} - True if session is expired
     */
    isSessionExpired(loginTime) {
        if (!loginTime) return true;

        const loginDate = new Date(loginTime);
        const now = new Date();
        const elapsed = now - loginDate;

        return elapsed > this.CONFIG.SESSION_TIMEOUT_MS;
    },

    /**
     * Get remaining session time in minutes
     * 
     * @param {string} loginTime - ISO timestamp of login
     * @returns {number} - Minutes remaining, 0 if expired
     */
    getSessionRemainingMinutes(loginTime) {
        if (!loginTime) return 0;

        const loginDate = new Date(loginTime);
        const now = new Date();
        const elapsed = now - loginDate;
        const remaining = this.CONFIG.SESSION_TIMEOUT_MS - elapsed;

        return Math.max(0, Math.floor(remaining / 60000));
    },

    // ========================
    // Login Attempt Tracking
    // ========================

    /**
     * Record a failed login attempt
     * 
     * @param {string} username - Username that failed
     */
    recordFailedAttempt(username) {
        const key = 'crms_login_attempts';
        const attempts = JSON.parse(localStorage.getItem(key) || '{}');

        if (!attempts[username]) {
            attempts[username] = { count: 0, firstAttempt: new Date().toISOString() };
        }

        attempts[username].count++;
        attempts[username].lastAttempt = new Date().toISOString();

        localStorage.setItem(key, JSON.stringify(attempts));
    },

    /**
     * Check if account is locked due to too many attempts
     * 
     * @param {string} username - Username to check
     * @returns {object} - { locked: boolean, remainingMinutes: number }
     */
    checkAccountLock(username) {
        const key = 'crms_login_attempts';
        const attempts = JSON.parse(localStorage.getItem(key) || '{}');

        if (!attempts[username]) {
            return { locked: false, remainingMinutes: 0 };
        }

        const userAttempts = attempts[username];

        if (userAttempts.count >= this.CONFIG.MAX_LOGIN_ATTEMPTS) {
            const lastAttempt = new Date(userAttempts.lastAttempt);
            const now = new Date();
            const elapsed = now - lastAttempt;

            if (elapsed < this.CONFIG.LOCKOUT_DURATION_MS) {
                return {
                    locked: true,
                    remainingMinutes: Math.ceil((this.CONFIG.LOCKOUT_DURATION_MS - elapsed) / 60000)
                };
            } else {
                // Lockout expired, reset attempts
                this.clearLoginAttempts(username);
            }
        }

        return { locked: false, remainingMinutes: 0 };
    },

    /**
     * Clear login attempts for a user (on successful login)
     * 
     * @param {string} username - Username to clear
     */
    clearLoginAttempts(username) {
        const key = 'crms_login_attempts';
        const attempts = JSON.parse(localStorage.getItem(key) || '{}');
        delete attempts[username];
        localStorage.setItem(key, JSON.stringify(attempts));
    },

    // ========================
    // Input Validation
    // ========================

    /**
     * Sanitize input to prevent XSS
     * 
     * @param {string} input - User input to sanitize
     * @returns {string} - Sanitized string
     */
    sanitizeInput(input) {
        if (typeof input !== 'string') return '';

        return input
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#x27;')
            .replace(/\//g, '&#x2F;');
    },

    /**
     * Validate email format
     * 
     * @param {string} email - Email to validate
     * @returns {boolean} - True if valid email format
     */
    isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    },

    /**
     * Validate phone number (Indian format)
     * 
     * @param {string} phone - Phone number to validate
     * @returns {boolean} - True if valid phone format
     */
    isValidPhone(phone) {
        const phoneRegex = /^[6-9]\d{9}$/;
        return phone === '' || phoneRegex.test(phone.replace(/\D/g, ''));
    },

    /**
     * Validate registration number format
     * 
     * @param {string} regno - Registration number to validate
     * @returns {boolean} - True if valid format
     */
    isValidRegno(regno) {
        // Format: YYKXXAXXXX (e.g., 23K61A4401)
        const regnoRegex = /^\d{2}K\d{2}[A-Z]\d{4}$/i;
        return regnoRegex.test(regno);
    },

    /**
     * Validate password strength
     * 
     * @param {string} password - Password to validate
     * @returns {object} - { valid: boolean, message: string }
     */
    validatePassword(password) {
        if (!password) {
            return { valid: false, message: 'Password is required' };
        }

        if (password.length < this.CONFIG.PASSWORD_MIN_LENGTH) {
            return { valid: false, message: `Password must be at least ${this.CONFIG.PASSWORD_MIN_LENGTH} characters` };
        }

        if (password.length > this.CONFIG.PASSWORD_MAX_LENGTH) {
            return { valid: false, message: 'Password is too long' };
        }

        return { valid: true, message: 'Password is valid' };
    },

    // ========================
    // Audit Logging
    // ========================

    /**
     * Create an audit log entry with enhanced details
     * 
     * @param {string} action - Action type
     * @param {string} details - Action details
     * @param {string} user - User who performed action
     * @param {string} severity - Log severity: INFO, WARNING, CRITICAL
     */
    auditLog(action, details, user, severity = 'INFO') {
        const logs = JSON.parse(localStorage.getItem('crms_audit_log') || '[]');

        logs.unshift({
            id: this.generateSessionToken().substring(0, 16),
            timestamp: new Date().toISOString(),
            action: action,
            details: this.sanitizeInput(details),
            user: this.sanitizeInput(user),
            severity: severity,
            userAgent: navigator.userAgent.substring(0, 100),
            sessionId: this.getCurrentSessionId()
        });

        // Keep only last 1000 entries
        if (logs.length > 1000) {
            logs.length = 1000;
        }

        localStorage.setItem('crms_audit_log', JSON.stringify(logs));
    },

    /**
     * Get current session ID for audit purposes
     * 
     * @returns {string} - Current session ID or 'NO_SESSION'
     */
    getCurrentSessionId() {
        const session = localStorage.getItem('crms_session');
        if (!session) return 'NO_SESSION';

        try {
            const parsed = JSON.parse(session);
            return parsed.sessionId || 'LEGACY_SESSION';
        } catch {
            return 'INVALID_SESSION';
        }
    },

    // ========================
    // First Login Detection
    // ========================

    /**
     * Check if user needs to change password (first login)
     * 
     * @param {string} username - Username to check
     * @returns {boolean} - True if password change required
     */
    requiresPasswordChange(username) {
        const firstLogins = JSON.parse(localStorage.getItem('crms_first_logins') || '{}');
        return firstLogins[username] !== true;
    },

    /**
     * Mark user as having changed password
     * 
     * @param {string} username - Username to mark
     */
    markPasswordChanged(username) {
        const firstLogins = JSON.parse(localStorage.getItem('crms_first_logins') || '{}');
        firstLogins[username] = true;
        localStorage.setItem('crms_first_logins', JSON.stringify(firstLogins));
    }
};

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = Security;
}
