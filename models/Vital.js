// Vital.js - Mongoose model for vital readings
const mongoose = require('mongoose');

const VitalSchema = new mongoose.Schema({
  patient: { type: String, ref: 'User', required: true },
  type: { type: String, enum: ['bp', 'hr', 'glucose', 'other'], required: true },
  value: { type: String, required: true },
  date: { type: Date, required: true },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Vital', VitalSchema);
