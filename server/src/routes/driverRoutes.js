const express = require('express');
const router = express.Router();
const { getDrivers, addDriver, getMyAssignedTrips } = require('../controllers/driverController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

router.get('/', getDrivers);
router.get('/my-trips', protect, getMyAssignedTrips);
router.post('/', protect, authorize('ADMIN'), addDriver);

module.exports = router;
