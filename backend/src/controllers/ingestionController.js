/**
 * Ingestion Controller
 * CRMS Backend
 * 
 * Handles file uploads, parsing, validation, and data commit
 */

const fs = require('fs');
const path = require('path');
const { IngestionJob, Student, Subject, Marks, AuditLog } = require('../models');

// Parsers (will be conditionally required if available)
let csvParser, xlsx;
try { csvParser = require('csv-parser'); } catch (e) { }
try { xlsx = require('xlsx'); } catch (e) { }

/**
 * Upload and start processing a file
 */
exports.uploadFile = async (req, res) => {
    try {
        const { targetEntity } = req.body;

        if (!targetEntity) {
            return res.status(400).json({ success: false, message: 'targetEntity required' });
        }

        const job = await IngestionJob.create({
            fileName: req.file.filename,
            originalName: req.file.originalname,
            fileType: req.fileType,
            fileSize: req.file.size,
            filePath: req.file.path,
            uploadedBy: req.user.id,
            targetEntity,
            status: 'UPLOADED'
        });

        // Start processing async
        processFile(job._id);

        res.status(201).json({
            success: true,
            data: {
                jobId: job._id,
                status: job.status,
                message: 'File uploaded. Processing started.'
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

/**
 * Process file in background
 */
async function processFile(jobId) {
    const job = await IngestionJob.findById(jobId);
    if (!job) return;

    try {
        job.status = 'PROCESSING';
        job.processingStartedAt = new Date();
        await job.save();

        let extractedData = [];

        // Parse based on file type
        switch (job.fileType) {
            case 'json':
                const jsonContent = fs.readFileSync(job.filePath, 'utf8');
                extractedData = JSON.parse(jsonContent);
                if (!Array.isArray(extractedData)) extractedData = [extractedData];
                break;

            case 'csv':
                if (csvParser) {
                    extractedData = await parseCSV(job.filePath);
                } else {
                    throw new Error('CSV parser not installed. Run: npm install csv-parser');
                }
                break;

            case 'xlsx':
            case 'xls':
                if (xlsx) {
                    extractedData = parseExcel(job.filePath);
                } else {
                    throw new Error('Excel parser not installed. Run: npm install xlsx');
                }
                break;

            case 'pdf':
            case 'doc':
            case 'docx':
            case 'image':
                // Mark for AI processing (not implemented here)
                job.aiRequiresReview = true;
                job.aiConfidence = 0;
                job.status = 'EXTRACTED';
                job.validationWarnings.push({
                    row: 0,
                    field: 'file',
                    message: 'This file type requires manual data extraction or AI processing',
                    severity: 'WARNING'
                });
                await job.save();
                return;

            default:
                throw new Error(`Unsupported file type: ${job.fileType}`);
        }

        job.extractedData = extractedData;
        job.extractedCount = extractedData.length;
        job.status = 'EXTRACTED';
        await job.save();

        // Run validation
        await validateExtractedData(job);

    } catch (error) {
        job.status = 'FAILED';
        job.processingError = error.message;
        job.processingCompletedAt = new Date();
        await job.save();
    }
}

/**
 * Parse CSV file
 */
function parseCSV(filePath) {
    return new Promise((resolve, reject) => {
        const results = [];
        fs.createReadStream(filePath)
            .pipe(csvParser())
            .on('data', (data) => results.push(data))
            .on('end', () => resolve(results))
            .on('error', reject);
    });
}

/**
 * Parse Excel file
 */
function parseExcel(filePath) {
    const workbook = xlsx.readFile(filePath);
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    return xlsx.utils.sheet_to_json(sheet);
}

/**
 * Validate extracted data
 */
async function validateExtractedData(job) {
    const errors = [];
    const warnings = [];
    const conflicts = [];

    for (let i = 0; i < job.extractedData.length; i++) {
        const row = job.extractedData[i];
        const rowNum = i + 1;

        switch (job.targetEntity) {
            case 'students':
                // Validate student data
                if (!row.regno) {
                    errors.push({ row: rowNum, field: 'regno', message: 'Registration number required', severity: 'ERROR' });
                } else if (!/^\d{2}K\d{2}[A-Z]\d{4}$/i.test(row.regno)) {
                    errors.push({ row: rowNum, field: 'regno', value: row.regno, message: 'Invalid registration number format', severity: 'ERROR' });
                } else {
                    // Check for existing
                    const existing = await Student.findOne({ regno: row.regno.toUpperCase() });
                    if (existing) {
                        conflicts.push({
                            existingId: existing._id,
                            existingData: { regno: existing.regno, name: existing.name },
                            newData: row,
                            resolution: 'PENDING'
                        });
                    }
                }

                if (!row.name) {
                    errors.push({ row: rowNum, field: 'name', message: 'Name required', severity: 'ERROR' });
                }

                if (!row.gender || !['M', 'F', 'O'].includes(row.gender?.toUpperCase())) {
                    warnings.push({ row: rowNum, field: 'gender', value: row.gender, message: 'Invalid gender', severity: 'WARNING' });
                }
                break;

            case 'marks':
                // Validate marks data
                if (!row.regno) {
                    errors.push({ row: rowNum, field: 'regno', message: 'Registration number required', severity: 'ERROR' });
                }
                if (!row.subjectCode) {
                    errors.push({ row: rowNum, field: 'subjectCode', message: 'Subject code required', severity: 'ERROR' });
                }
                if (row.internalMarks !== undefined) {
                    const internal = parseFloat(row.internalMarks);
                    if (isNaN(internal) || internal < 0 || internal > 40) {
                        errors.push({ row: rowNum, field: 'internalMarks', value: row.internalMarks, message: 'Internal marks must be 0-40', severity: 'ERROR' });
                    }
                }
                if (row.externalMarks !== undefined) {
                    const external = parseFloat(row.externalMarks);
                    if (isNaN(external) || external < 0 || external > 60) {
                        errors.push({ row: rowNum, field: 'externalMarks', value: row.externalMarks, message: 'External marks must be 0-60', severity: 'ERROR' });
                    }
                }
                break;

            case 'subjects':
                if (!row.code) {
                    errors.push({ row: rowNum, field: 'code', message: 'Subject code required', severity: 'ERROR' });
                }
                if (!row.name) {
                    errors.push({ row: rowNum, field: 'name', message: 'Subject name required', severity: 'ERROR' });
                }
                if (!row.credits || parseFloat(row.credits) <= 0) {
                    errors.push({ row: rowNum, field: 'credits', message: 'Valid credits required', severity: 'ERROR' });
                }
                break;
        }
    }

    job.validationErrors = errors;
    job.validationWarnings = warnings;
    job.conflicts = conflicts;
    job.status = errors.length === 0 ? 'PREVIEW_READY' : 'VALIDATED';
    job.processingCompletedAt = new Date();
    await job.save();
}

/**
 * Get all ingestion jobs
 */
exports.getJobs = async (req, res) => {
    try {
        const { status, page = 1, limit = 20 } = req.query;

        const query = { uploadedBy: req.user.id };
        if (status) query.status = status;

        const jobs = await IngestionJob.find(query)
            .select('-extractedData')
            .skip((page - 1) * limit)
            .limit(parseInt(limit))
            .sort({ createdAt: -1 });

        res.json({ success: true, data: jobs });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

/**
 * Get single job
 */
exports.getJob = async (req, res) => {
    try {
        const job = await IngestionJob.findById(req.params.jobId).select('-extractedData');
        if (!job) {
            return res.status(404).json({ success: false, message: 'Job not found' });
        }
        res.json({ success: true, data: job });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

/**
 * Get preview data
 */
exports.getPreview = async (req, res) => {
    try {
        const { page = 1, limit = 50 } = req.query;
        const job = await IngestionJob.findById(req.params.jobId);

        if (!job) {
            return res.status(404).json({ success: false, message: 'Job not found' });
        }

        const start = (page - 1) * limit;
        const previewData = job.extractedData.slice(start, start + parseInt(limit));

        res.json({
            success: true,
            data: {
                preview: previewData,
                total: job.extractedCount,
                errors: job.validationErrors,
                warnings: job.validationWarnings,
                conflicts: job.conflicts,
                pagination: { page: parseInt(page), limit: parseInt(limit) }
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

/**
 * Resolve conflicts
 */
exports.resolveConflicts = async (req, res) => {
    try {
        const { resolutions } = req.body; // [{ index: 0, resolution: 'SKIP' | 'MERGE' | 'OVERWRITE' }]
        const job = await IngestionJob.findById(req.params.jobId);

        if (!job) {
            return res.status(404).json({ success: false, message: 'Job not found' });
        }

        resolutions.forEach(r => {
            if (job.conflicts[r.index]) {
                job.conflicts[r.index].resolution = r.resolution;
            }
        });

        // Check if all conflicts resolved
        const unresolved = job.conflicts.filter(c => c.resolution === 'PENDING').length;
        if (unresolved === 0 && job.validationErrors.length === 0) {
            job.status = 'PREVIEW_READY';
        }

        await job.save();

        res.json({ success: true, unresolvedConflicts: unresolved });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

/**
 * Approve preview
 */
exports.approvePreview = async (req, res) => {
    try {
        const job = await IngestionJob.findById(req.params.jobId);

        if (!job) {
            return res.status(404).json({ success: false, message: 'Job not found' });
        }

        if (job.status !== 'PREVIEW_READY') {
            return res.status(400).json({
                success: false,
                message: `Cannot approve. Current status: ${job.status}. Fix errors first.`
            });
        }

        job.previewApproved = true;
        job.previewApprovedAt = new Date();
        job.previewApprovedBy = req.user.id;
        await job.save();

        res.json({ success: true, message: 'Preview approved. Ready to commit.' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

/**
 * Commit job (actually insert data)
 */
exports.commitJob = async (req, res) => {
    try {
        const job = await IngestionJob.findById(req.params.jobId);

        if (!job) {
            return res.status(404).json({ success: false, message: 'Job not found' });
        }

        if (!job.previewApproved) {
            return res.status(400).json({ success: false, message: 'Preview must be approved before commit' });
        }

        if (job.status === 'COMMITTED') {
            return res.status(400).json({ success: false, message: 'Job already committed' });
        }

        const results = { created: 0, updated: 0, skipped: 0, failed: 0 };

        for (let i = 0; i < job.extractedData.length; i++) {
            const row = job.extractedData[i];

            // Check if this row has a conflict
            const conflict = job.conflicts.find(c =>
                JSON.stringify(c.newData) === JSON.stringify(row)
            );

            if (conflict) {
                if (conflict.resolution === 'SKIP') {
                    results.skipped++;
                    continue;
                }
            }

            try {
                switch (job.targetEntity) {
                    case 'students':
                        if (conflict && conflict.resolution === 'OVERWRITE') {
                            await Student.findByIdAndUpdate(conflict.existingId, {
                                name: row.name,
                                gender: row.gender?.toUpperCase(),
                                email: row.email,
                                phone: row.phone
                            });
                            results.updated++;
                        } else if (conflict && conflict.resolution === 'MERGE') {
                            // Merge: only update empty fields
                            const existing = await Student.findById(conflict.existingId);
                            if (!existing.email && row.email) existing.email = row.email;
                            if (!existing.phone && row.phone) existing.phone = row.phone;
                            await existing.save();
                            results.updated++;
                        } else {
                            await Student.create({
                                regno: row.regno.toUpperCase(),
                                name: row.name,
                                gender: row.gender?.toUpperCase() || 'M',
                                email: row.email,
                                phone: row.phone,
                                departmentId: row.departmentId || req.body.defaultDepartmentId,
                                regulationId: row.regulationId || req.body.defaultRegulationId,
                                batchYear: row.batchYear || new Date().getFullYear()
                            });
                            results.created++;
                        }
                        break;

                    case 'subjects':
                        await Subject.create({
                            code: row.code.toUpperCase(),
                            name: row.name,
                            credits: parseFloat(row.credits),
                            type: row.type || 'THEORY',
                            semester: parseInt(row.semester),
                            regulationId: row.regulationId || req.body.defaultRegulationId
                        });
                        results.created++;
                        break;

                    case 'marks':
                        const student = await Student.findOne({ regno: row.regno.toUpperCase() });
                        const subject = await Subject.findOne({ code: row.subjectCode.toUpperCase() });

                        if (!student || !subject) {
                            results.failed++;
                            continue;
                        }

                        await Marks.findOneAndUpdate(
                            { studentId: student._id, subjectId: subject._id, semester: parseInt(row.semester) },
                            {
                                internalMarks: parseFloat(row.internalMarks),
                                externalMarks: parseFloat(row.externalMarks),
                                academicYear: row.academicYear || req.body.defaultAcademicYear,
                                enteredBy: req.user.id,
                                status: 'DRAFT'
                            },
                            { upsert: true, new: true }
                        );
                        results.created++;
                        break;
                }
            } catch (err) {
                results.failed++;
            }
        }

        job.status = 'COMMITTED';
        job.committedAt = new Date();
        job.committedBy = req.user.id;
        job.commitResult = results;
        await job.save();

        // Create audit log
        const auditLog = await AuditLog.log({
            action: 'DATA_COMMIT',
            actorId: req.user.id,
            actorModel: 'User',
            actorName: req.user.name,
            actorRole: req.user.role,
            targetType: job.targetEntity,
            details: `Committed ${job.originalName}`,
            metadata: results,
            changeType: 'BULK',
            affectedCount: results.created + results.updated,
            ip: req.ip,
            reAuthAt: req.reAuthAt,
            severity: 'INFO'
        });

        job.auditId = auditLog._id;
        await job.save();

        res.json({ success: true, results });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

/**
 * Cancel job
 */
exports.cancelJob = async (req, res) => {
    try {
        const job = await IngestionJob.findById(req.params.jobId);

        if (!job) {
            return res.status(404).json({ success: false, message: 'Job not found' });
        }

        if (job.status === 'COMMITTED') {
            return res.status(400).json({ success: false, message: 'Cannot cancel committed job' });
        }

        job.status = 'CANCELLED';
        await job.save();

        // Clean up file
        if (job.filePath && fs.existsSync(job.filePath)) {
            fs.unlinkSync(job.filePath);
        }

        res.json({ success: true, message: 'Job cancelled' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
