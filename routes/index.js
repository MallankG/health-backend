var express = require('express');
var router = express.Router();
const reportsController = require('../controllers/reportsController');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

// Upload a report
router.post('/upload', reportsController.uploadReport);

// List reports for a patient
router.get('/', reportsController.getReports);

// Delete a report
router.delete('/:id', reportsController.deleteReport);

module.exports = router;
