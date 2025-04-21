// Report.js - Mongoose model for medical reports
const mongoose = require('mongoose');

const ReportSchema = new mongoose.Schema({
  patient: { type: String, ref: 'User', required: true },
  fileUrl: { type: String, required: true },
  fileType: { type: String, enum: ['pdf', 'image'], required: true },
  category: { type: String }, // e.g., bloodwork, imaging
  uploadedAt: { type: Date, default: Date.now },
  tags: [String],
});

module.exports = mongoose.model('Report', ReportSchema);
