const express = require('express');
const router = express.Router();
const appointmentsController = require('../controllers/appointmentsController');

router.post('/book', appointmentsController.bookAppointment);
router.get('/', appointmentsController.getAppointments);
router.patch('/:id/cancel', appointmentsController.cancelAppointment);

module.exports = router;