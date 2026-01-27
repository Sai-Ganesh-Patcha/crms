/**
 * CRMS Configuration
 * Centralized configuration for API endpoints
 */

const Config = {
    // API Base URL Configuration
    // PRODUCTION: Update this after deploying backend to Render
    PRODUCTION_API_URL: 'https://crms-backend.onrender.com/api',  // ← UPDATE THIS with your actual backend URL

    // Development API URL
    DEVELOPMENT_API_URL: 'http://localhost:5000/api',

    // Auto-detect environment and use appropriate URL
    get API_BASE_URL() {
        // If running on Render or any production domain
        if (window.location.hostname.includes('onrender.com') ||
            window.location.hostname.includes('vercel.app') ||
            window.location.hostname.includes('netlify.app')) {
            return this.PRODUCTION_API_URL;
        }
        // Otherwise use development URL
        return this.DEVELOPMENT_API_URL;
    },

    // App Version
    VERSION: '1.0.0',

    // App Name
    APP_NAME: 'College Result Management System',

    // Timeout settings (in milliseconds)
    REQUEST_TIMEOUT: 30000,

    // Enable debug mode in development
    get DEBUG() {
        return !window.location.hostname.includes('onrender.com');
    },

    // Get full API URL for an endpoint
    getApiUrl: function (endpoint) {
        // Ensure endpoint starts with /
        const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
        return `${this.API_BASE_URL}${cleanEndpoint}`;
    },

    // Log helper (only logs in debug mode)
    log: function (...args) {
        if (this.DEBUG) {
            console.log('[CRMS Config]', ...args);
        }
    },

    // Error helper
    error: function (...args) {
        console.error('[CRMS Error]', ...args);
    },

    // Show current configuration
    showConfig: function () {
        console.log(`
╔═══════════════════════════════════════════════════════╗
║  CRMS Configuration                                   ║
╠═══════════════════════════════════════════════════════╣
║  Version: ${this.VERSION.padEnd(44)} ║
║  Environment: ${(this.DEBUG ? 'Development' : 'Production').padEnd(39)} ║
║  API URL: ${this.API_BASE_URL.substring(0, 44).padEnd(44)} ║
║  Debug Mode: ${(this.DEBUG ? 'ON' : 'OFF').padEnd(41)} ║
╚═══════════════════════════════════════════════════════╝
        `);
    }
};

// Make it globally available
window.Config = Config;

// Log configuration on load in debug mode
Config.log('Configuration loaded:', {
    apiUrl: Config.API_BASE_URL,
    version: Config.VERSION,
    debug: Config.DEBUG,
    hostname: window.location.hostname
});

// Show config in console
Config.showConfig();
