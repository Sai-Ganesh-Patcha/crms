/**
 * Auth Controller
 * CRMS Backend
 */

const { User, Student, AuditLog } = require('../models');
const { auth } = require('../middleware');

/**
 * Login (Students and Staff)
 */
exports.login = async (req, res) => {
    try {
        const { username, password, role } = req.body;

        let user, type;

        if (role === 'student') {
            // Student login
            user = await Student.findOne({ regno: username.toUpperCase() }).select('+password');
            type = 'student';

            if (!user) {
                await AuditLog.log({
                    action: 'LOGIN_FAILED',
                    details: `Student not found: ${username}`,
                    ip: req.ip,
                    severity: 'WARNING'
                });
                return res.status(401).json({ success: false, message: 'Invalid credentials' });
            }

            if (user.isSuspended) {
                await AuditLog.log({
                    action: 'LOGIN_FAILED',
                    actorId: user._id,
                    actorModel: 'Student',
                    details: 'Suspended student login attempt',
                    ip: req.ip,
                    severity: 'WARNING'
                });
                return res.status(403).json({ success: false, message: 'Account suspended' });
            }

            // First login: password = regno
            const isFirstLogin = user.firstLogin;
            const validPassword = await user.comparePassword(password);

            if (!validPassword) {
                await AuditLog.log({
                    action: 'LOGIN_FAILED',
                    actorId: user._id,
                    actorModel: 'Student',
                    details: 'Invalid password',
                    ip: req.ip,
                    severity: 'WARNING'
                });
                return res.status(401).json({ success: false, message: 'Invalid credentials' });
            }

        } else {
            // Staff login (faculty, hod, admin)
            user = await User.findOne({ username: username.toLowerCase() }).select('+password');
            type = 'user';

            if (!user || user.role !== role) {
                await AuditLog.log({
                    action: 'LOGIN_FAILED',
                    details: `User not found or role mismatch: ${username}`,
                    ip: req.ip,
                    severity: 'WARNING'
                });
                return res.status(401).json({ success: false, message: 'Invalid credentials' });
            }

            const validPassword = await user.comparePassword(password);

            if (!validPassword) {
                await AuditLog.log({
                    action: 'LOGIN_FAILED',
                    actorId: user._id,
                    actorModel: 'User',
                    details: 'Invalid password',
                    ip: req.ip,
                    severity: 'WARNING'
                });
                return res.status(401).json({ success: false, message: 'Invalid credentials' });
            }
        }

        // Generate tokens
        const payload = {
            id: user._id,
            type,
            role: type === 'student' ? 'student' : user.role
        };

        const { accessToken, refreshToken } = auth.generateTokens(payload);

        // Save refresh token
        user.refreshToken = refreshToken;
        user.lastLogin = new Date();
        await user.save();

        // Audit log
        await AuditLog.log({
            action: 'LOGIN',
            actorId: user._id,
            actorModel: type === 'student' ? 'Student' : 'User',
            actorName: user.name,
            actorRole: payload.role,
            details: 'Successful login',
            ip: req.ip,
            severity: 'INFO'
        });

        res.json({
            success: true,
            accessToken,
            refreshToken,
            user: {
                id: user._id,
                name: user.name,
                role: payload.role,
                ...(type === 'student' && { regno: user.regno, firstLogin: user.firstLogin })
            }
        });

    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ success: false, message: 'Login failed' });
    }
};

/**
 * Refresh access token
 */
exports.refreshToken = async (req, res) => {
    try {
        const { refreshToken } = req.body;

        if (!refreshToken) {
            return res.status(401).json({ success: false, message: 'Refresh token required' });
        }

        const decoded = auth.verifyRefreshToken(refreshToken);

        // Find user and verify refresh token
        let user;
        if (decoded.type === 'student') {
            user = await Student.findById(decoded.id).select('+refreshToken');
        } else {
            user = await User.findById(decoded.id).select('+refreshToken');
        }

        if (!user || user.refreshToken !== refreshToken) {
            return res.status(401).json({ success: false, message: 'Invalid refresh token' });
        }

        // Generate new tokens
        const payload = { id: user._id, type: decoded.type, role: decoded.role };
        const tokens = auth.generateTokens(payload);

        // Update refresh token
        user.refreshToken = tokens.refreshToken;
        await user.save();

        res.json({
            success: true,
            accessToken: tokens.accessToken,
            refreshToken: tokens.refreshToken
        });

    } catch (error) {
        return res.status(401).json({ success: false, message: 'Invalid refresh token' });
    }
};

/**
 * Logout
 */
exports.logout = async (req, res) => {
    try {
        // Clear refresh token
        if (req.user.type === 'student') {
            await Student.findByIdAndUpdate(req.user.id, { refreshToken: null });
        } else {
            await User.findByIdAndUpdate(req.user.id, { refreshToken: null });
        }

        await AuditLog.log({
            action: 'LOGOUT',
            actorId: req.user.id,
            actorModel: req.user.type === 'student' ? 'Student' : 'User',
            actorName: req.user.name,
            actorRole: req.user.role,
            ip: req.ip,
            severity: 'INFO'
        });

        res.json({ success: true, message: 'Logged out' });

    } catch (error) {
        res.status(500).json({ success: false, message: 'Logout failed' });
    }
};

/**
 * Change password
 */
exports.changePassword = async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;

        let user;
        if (req.user.type === 'student') {
            user = await Student.findById(req.user.id).select('+password');
        } else {
            user = await User.findById(req.user.id).select('+password');
        }

        const isValid = await user.comparePassword(currentPassword);
        if (!isValid) {
            return res.status(400).json({ success: false, message: 'Current password is incorrect' });
        }

        user.password = newPassword;
        if (req.user.type === 'student') {
            user.firstLogin = false;
        }
        await user.save();

        await AuditLog.log({
            action: 'PASSWORD_CHANGED',
            actorId: req.user.id,
            actorModel: req.user.type === 'student' ? 'Student' : 'User',
            actorName: req.user.name,
            actorRole: req.user.role,
            ip: req.ip,
            severity: 'INFO'
        });

        res.json({ success: true, message: 'Password changed successfully' });

    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to change password' });
    }
};

/**
 * Get current user info
 */
exports.getMe = async (req, res) => {
    try {
        let user;
        if (req.user.type === 'student') {
            user = await Student.findById(req.user.id);
        } else {
            user = await User.findById(req.user.id);
        }

        res.json({ success: true, user });

    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to get user' });
    }
};
