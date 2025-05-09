// Appointment.js - Mongoose model for appointments
const mongoose = require('mongoose');

const AppointmentSchema = new mongoose.Schema({
  patient: { type: String, ref: 'User', required: true },
  doctor: { type: String, ref: 'User', required: true },
  date: { type: Date, required: true },
  status: { type: String, enum: ['requested', 'booked', 'cancelled', 'completed'], default: 'requested' },
  purpose: { type: String },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Appointment', AppointmentSchema);
