/**
 * CRMS Configuration
 * Centralized configuration for API endpoints
 */

const Config = {
    // API Base URL - automatically uses production URL on Render
    API_BASE_URL: window.location.hostname.includes('onrender.com') 
        ? 'https://crms-backend.onrender.com/api'
        : 'http://localhost:5000/api',
    
    // App Version
    VERSION: '1.0.0',
    
    // App Name
    APP_NAME: 'College Result Management System',
    
    // Timeout settings (in milliseconds)
    REQUEST_TIMEOUT: 30000,
    
    // Enable debug mode in development
    DEBUG: !window.location.hostname.includes('onrender.com'),
    
    // Get full API URL
    getApiUrl: function(endpoint) {
        return `${this.API_BASE_URL}${endpoint}`;
    },
    
    // Log helper
    log: function(...args) {
        if (this.DEBUG) {
            console.log('[CRMS]', ...args);
        }
    }
};

// Make it globally available
window.Config = Config;

// Log configuration on load
Config.log('Configuration loaded:', {
    apiUrl: Config.API_BASE_URL,
    version: Config.VERSION,
    debug: Config.DEBUG
});
