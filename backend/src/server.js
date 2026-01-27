/**
 * CRMS Backend - Express Server
 * Production-grade College Result Management System
 */

require('dotenv').config();

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');

const connectDB = require('./config/db');
const routes = require('./routes');
const { errorHandler } = require('./middleware');

// Initialize Express
const app = express();

// Connect to MongoDB
connectDB();

// ======================
// Security Middleware
// ======================

// Helmet - security headers
app.use(helmet());

// CORS
app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

// Rate limiting
const limiter = rateLimit({
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000, // 15 min
    max: parseInt(process.env.RATE_LIMIT_MAX) || 100,
    message: {
        success: false,
        message: 'Too many requests, please try again later'
    }
});
app.use('/api', limiter);

// Stricter rate limit for auth endpoints
const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 10,
    message: {
        success: false,
        message: 'Too many login attempts, please try again later'
    }
});
app.use('/api/auth/login', authLimiter);

// ======================
// Body Parsing
// ======================

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// ======================
// Logging
// ======================

if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
} else {
    app.use(morgan('combined'));
}

// ======================
// API Routes
// ======================

app.use('/api', routes);

// Root endpoint
app.get('/', (req, res) => {
    res.json({
        success: true,
        message: 'CRMS API Server',
        version: '1.0.0',
        docs: '/api/health'
    });
});

// ======================
// Error Handling
// ======================

app.use(errorHandler.notFound);
app.use(errorHandler.errorHandler);

// ======================
// Start Server
// ======================

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
    console.log(`
╔═══════════════════════════════════════════════════════╗
║                                                       ║
║   🎓 CRMS Backend Server                              ║
║                                                       ║
║   Environment: ${process.env.NODE_ENV || 'development'}                          ║
║   Port: ${PORT}                                          ║
║   API: http://localhost:${PORT}/api                      ║
║                                                       ║
╚═══════════════════════════════════════════════════════╝
    `);
});

// Graceful shutdown
process.on('SIGTERM', () => {
    console.log('SIGTERM received. Shutting down gracefully...');
    server.close(() => {
        console.log('Process terminated');
        process.exit(0);
    });
});

module.exports = app;
