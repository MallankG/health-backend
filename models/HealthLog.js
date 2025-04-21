// HealthLog.js - Mongoose model for sleep and exercise logs
const mongoose = require('mongoose');

const HealthLogSchema = new mongoose.Schema({
  patient: { type: String, ref: 'User', required: true },
  type: { type: String, enum: ['sleep', 'exercise'], required: true },
  value: { type: String, required: true }, // e.g., hours slept, exercise type
  date: { type: Date, required: true },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('HealthLog', HealthLogSchema);
