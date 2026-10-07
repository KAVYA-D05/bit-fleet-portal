const express = require('express');
const router = express.Router();
const { startTrip, completeTrip } = require('../controllers/tripLogController');
const { protect } = require('../middleware/authMiddleware');

router.post('/start', protect, startTrip);
router.post('/complete', protect, completeTrip);

module.exports = router;
