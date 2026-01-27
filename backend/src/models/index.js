/**
 * Models Index
 * CRMS Backend
 */

module.exports = {
    User: require('./User'),
    Student: require('./Student'),
    Department: require('./Department'),
    Regulation: require('./Regulation'),
    Subject: require('./Subject'),
    Marks: require('./Marks'),
    Result: require('./Result'),
    AuditLog: require('./AuditLog'),
    IngestionJob: require('./IngestionJob')
};
