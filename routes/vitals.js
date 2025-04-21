const express = require('express');
const router = express.Router();
const vitalsController = require('../controllers/vitalsController');

router.post('/add', vitalsController.addVital);
router.get('/', vitalsController.getVitals);
router.delete('/:id', vitalsController.deleteVital);

module.exports = router;