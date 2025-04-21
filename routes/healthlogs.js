const express = require('express');
const router = express.Router();
const healthLogsController = require('../controllers/healthLogsController');

router.post('/add', healthLogsController.addHealthLog);
router.get('/', healthLogsController.getHealthLogs);
router.delete('/:id', healthLogsController.deleteHealthLog);

module.exports = router;