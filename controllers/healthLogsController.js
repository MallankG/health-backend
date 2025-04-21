// HealthLog controller: CRUD for sleep and exercise logs
const mongoose = require('mongoose');
const HealthLog = require('../models/HealthLog');

// Add a health log entry
exports.addHealthLog = async (req, res) => {
  try {
    const { patient, type, value, date } = req.body;
    const log = new HealthLog({ patient, type, value, date });
    await log.save();
    res.status(201).json(log);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// List health logs for a patient
exports.getHealthLogs = async (req, res) => {
  try {
    const { patient, type } = req.query;
    if (!patient) {
      return res.status(400).json({ message: 'Invalid or missing patient id' });
    }
    const filter = { patient };
    if (type) filter.type = type;
    const logs = await HealthLog.find(filter);
    res.json(logs);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Delete a health log entry
exports.deleteHealthLog = async (req, res) => {
  try {
    const { id } = req.params;
    const log = await HealthLog.findByIdAndDelete(id);
    if (!log) return res.status(404).json({ message: 'Log not found' });
    res.json({ message: 'Log deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};
