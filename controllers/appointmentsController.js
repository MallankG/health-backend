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
      purpose,
      status: 'requested'
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
    const { userId, role, patientName } = req.query;
    console.log('getAppointments called with:', { userId, role, patientName });
    let filter = {};
    if (!userId) {
      console.error('Invalid or missing userId:', userId);
      return res.status(400).json({ message: 'Invalid or missing userId' });
    }
    if (role === 'patient') filter.patient = userId;
    if (role === 'doctor') filter.doctor = userId;

    let query = Appointment.find(filter).populate('patient doctor', 'name email');
    // If doctor and patientName is provided, filter by patient name
    if (role === 'doctor' && patientName && patientName.trim() !== '') {
      // Use aggregation to match patient name
      query = Appointment.aggregate([
        { $match: filter },
        { $lookup: {
            from: 'users',
            localField: 'patient',
            foreignField: '_id',
            as: 'patientObj'
        }},
        { $unwind: '$patientObj' },
        { $match: { 'patientObj.name': { $regex: patientName, $options: 'i' } } },
        { $lookup: {
            from: 'users',
            localField: 'doctor',
            foreignField: '_id',
            as: 'doctorObj'
        }},
        { $unwind: '$doctorObj' },
        { $project: {
            _id: 1,
            patient: { _id: '$patientObj._id', name: '$patientObj.name', email: '$patientObj.email' },
            doctor: { _id: '$doctorObj._id', name: '$doctorObj.name', email: '$doctorObj.email' },
            date: 1,
            status: 1,
            purpose: 1,
            createdAt: 1
        }}
      ]);
      const appointments = await query.exec();
      return res.json(appointments);
    }
    // Default: normal find with population
    const appointments = await query.exec();
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

// Accept an appointment (doctor action)
exports.acceptAppointment = async (req, res) => {
  try {
    const { id } = req.params;
    const appointment = await Appointment.findByIdAndUpdate(
      id,
      { status: 'booked' },
      { new: true }
    );
    if (!appointment) return res.status(404).json({ message: 'Appointment not found' });
    // TODO: Send notification to patient here
    res.json({ message: 'Appointment accepted', appointment });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};
