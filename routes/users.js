const express = require('express');
const router = express.Router();
const appointmentsController = require('../controllers/appointmentsController');
const vitalsController = require('../controllers/vitalsController');
const usersController = require('../controllers/usersController');
const User = require('../models/User');

// Book appointment
router.post('/book', appointmentsController.bookAppointment);
// List appointments for a user
router.get('/', appointmentsController.getAppointments);
// Cancel appointment
router.patch('/:id/cancel', appointmentsController.cancelAppointment);

// Add vital
router.post('/add', vitalsController.addVital);
// List vitals
router.get('/', vitalsController.getVitals);
// Delete vital
router.delete('/:id', vitalsController.deleteVital);

// Search users by name (case-insensitive, partial match)
router.get('/search', usersController.searchUsers);

module.exports = router;
