// Vital controller: CRUD for vital readings
const mongoose = require('mongoose');
const Vital = require('../models/Vital');

// Add a vital reading
exports.addVital = async (req, res) => {
  try {
    const { patient, type, value, date } = req.body;
    const vital = new Vital({ patient, type, value, date });
    await vital.save();
    res.status(201).json(vital);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// List vitals for a patient
exports.getVitals = async (req, res) => {
  try {
    const { patient, type } = req.query;
    if (!patient) {
      return res.status(400).json({ message: 'Invalid or missing patient id' });
    }
    const filter = { patient };
    if (type) filter.type = type;
    const vitals = await Vital.find(filter);
    res.json(vitals);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Delete a vital reading
exports.deleteVital = async (req, res) => {
  try {
    const { id } = req.params;
    const vital = await Vital.findByIdAndDelete(id);
    if (!vital) return res.status(404).json({ message: 'Vital not found' });
    res.json({ message: 'Vital deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};
