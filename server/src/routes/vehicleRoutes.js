const express = require('express');
const router = express.Router();
const {
  getVehicles,
  getLiveLocations,
  addVehicle,
  updateVehicle,
  updateGpsLocation
} = require('../controllers/vehicleController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

router.get('/live-locations', getLiveLocations);
router.get('/', getVehicles);
router.post('/', protect, authorize('ADMIN'), addVehicle);
router.put('/:id/location', updateGpsLocation);
router.put('/:id', protect, authorize('ADMIN'), updateVehicle);

module.exports = router;
