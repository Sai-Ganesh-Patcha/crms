/**
 * Middleware Index
 * CRMS Backend
 */

module.exports = {
    auth: require('./auth'),
    rbac: require('./rbac'),
    validate: require('./validate'),
    errorHandler: require('./errorHandler'),
    operator: require('./operator')
};
