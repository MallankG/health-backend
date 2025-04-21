// Appointment controller: CRUD for appointments
const mongoose = require('mongoose');
const Appointment = require('../models/Appointment');

// Book a new appointment
exports.bookAppointment = async (req, res) => {
  try {
    const { patient, doctor, date, purpose } = req.body;
    const appointment = new Appointment({
      patient,
      doctor,
      date,
      purpose
    });
    await appointment.save();
    res.status(201).json(appointment);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// List appointments for a user (patient or doctor)
exports.getAppointments = async (req, res) => {
  try {
    const { userId, role } = req.query;
    console.log('getAppointments called with:', { userId, role });
    let filter = {};
    if (!userId) {
      console.error('Invalid or missing userId:', userId);
      return res.status(400).json({ message: 'Invalid or missing userId' });
    }
    if (role === 'patient') filter.patient = userId;
    if (role === 'doctor') filter.doctor = userId;
    console.log('MongoDB filter:', filter);
    const appointments = await Appointment.find(filter).populate('patient doctor', 'name email');
    res.json(appointments);
  } catch (err) {
    console.error('getAppointments error:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Cancel or delete an appointment
exports.cancelAppointment = async (req, res) => {
  try {
    const { id } = req.params;
    const appointment = await Appointment.findByIdAndUpdate(id, { status: 'cancelled' }, { new: true });
    if (!appointment) return res.status(404).json({ message: 'Appointment not found' });
    res.json({ message: 'Appointment cancelled', appointment });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};
