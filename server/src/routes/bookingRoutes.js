const express = require('express');
const router = express.Router();
const {
  checkAvailability,
  createBooking,
  getBookings,
  getBookingById,
  handleApproval,
  cancelBooking,
  submitTripRating,
  assignVehicleAndDriver,
  updateStatus,
  reviewTripFeedback,
  getTripSafetyCockpit,
  triggerTripSOS
} = require('../controllers/bookingController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

router.post('/check-availability', checkAvailability);
router.post('/', protect, createBooking);
router.get('/', protect, getBookings);
router.get('/:id', protect, getBookingById);
router.get('/:id/safety-cockpit', protect, getTripSafetyCockpit);
router.post('/:id/trigger-sos', protect, triggerTripSOS);
router.put('/:id/approval', protect, authorize('ADMIN'), handleApproval);
router.put('/:id/cancel', protect, cancelBooking);
router.put('/:id/rating', protect, submitTripRating);
router.put('/:id/feedback-review', protect, authorize('ADMIN'), reviewTripFeedback);
router.put('/:id/assign', protect, authorize('ADMIN'), assignVehicleAndDriver);
router.put('/:id/status', protect, updateStatus);

module.exports = router;
