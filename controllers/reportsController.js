const Report = require('../models/Report');
const multer = require('multer');
const path = require('path');
const mongoose = require('mongoose');

// Multer storage config
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, '../public/reports'));
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + '-' + file.originalname);
  }
});
const upload = multer({ storage });

// Upload a report
exports.uploadReport = [
  upload.single('file'),
  async (req, res) => {
    try {
      const { category, tags, patient } = req.body;
      if (!req.file) return res.status(400).json({ message: 'No file uploaded' });
      const fileType = req.file.mimetype.includes('pdf') ? 'pdf' : 'image';
      const report = new Report({
        patient,
        fileUrl: `/reports/${req.file.filename}`,
        fileType,
        category,
        tags: tags ? tags.split(',') : [],
      });
      await report.save();
      res.status(201).json(report);
    } catch (err) {
      console.error('Upload report error:', err); // Log the error details
      res.status(500).json({ message: 'Server error', error: err.message });
    }
  }
];

// List all reports for a patient
exports.getReports = async (req, res) => {
  try {
    const { patient } = req.query;
    if (!patient) {
      return res.status(400).json({ message: 'Invalid or missing patient id' });
    }
    const reports = await Report.find({ patient });
    res.json(reports);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Delete a report
exports.deleteReport = async (req, res) => {
  try {
    const { id } = req.params;
    const report = await Report.findByIdAndDelete(id);
    if (!report) return res.status(404).json({ message: 'Report not found' });
    res.json({ message: 'Report deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};