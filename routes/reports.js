const express = require('express');
const router = express.Router();
const reportsController = require('../controllers/reportsController');

router.post('/upload', reportsController.uploadReport);
router.get('/', reportsController.getReports);
router.delete('/:id', reportsController.deleteReport);

module.exports = router;