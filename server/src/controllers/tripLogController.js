const TripLog = require('../models/TripLog');
const Booking = require('../models/Booking');
const Vehicle = require('../models/Vehicle');
const { getIsConnectedToMongo } = require('../config/db');
const store = require('../utils/dataStore');

// @desc    Start a Trip & Record Initial Odometer Reading
// @route   POST /api/trips/start
// @access  Private (Driver or Admin)
exports.startTrip = async (req, res) => {
  try {
    const { bookingId, startOdometer } = req.body;

    if (!bookingId || startOdometer === undefined) {
      return res.status(400).json({ success: false, message: 'Booking ID and Start Odometer reading are required.' });
    }

    if (getIsConnectedToMongo()) {
      const booking = await Booking.findById(bookingId);
      if (!booking) return res.status(404).json({ success: false, message: 'Booking not found' });

      booking.status = 'IN_PROGRESS';
      await booking.save();

      const log = await TripLog.create({
        bookingId,
        vehicleId: booking.assignedVehicleId,
        driverId: booking.assignedDriverId,
        startOdometer: Number(startOdometer),
        startedAt: new Date()
      });

      return res.status(200).json({
        success: true,
        message: 'Trip started successfully. Odometer reading recorded.',
        tripLog: log,
        booking
      });
    } else {
      const bIdx = store.bookings.findIndex(b => b._id === bookingId || b.id === bookingId);
      if (bIdx === -1) return res.status(404).json({ success: false, message: 'Booking not found' });

      store.bookings[bIdx].status = 'IN_PROGRESS';
      const booking = store.bookings[bIdx];

      const newLog = {
        _id: `log_${Date.now()}`,
        bookingId,
        vehicleId: booking.assignedVehicleId,
        driverId: booking.assignedDriverId,
        startOdometer: Number(startOdometer),
        startedAt: new Date().toISOString()
      };

      store.tripLogs.push(newLog);

      return res.status(200).json({
        success: true,
        message: 'Trip started successfully. Odometer reading recorded.',
        tripLog: newLog,
        booking: store.populateBooking(booking)
      });
    }
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to start trip', error: error.message });
  }
};

// @desc    Complete Trip & Record Final Odometer, Fuel, and Tolls
// @route   POST /api/trips/complete
// @access  Private (Driver or Admin)
exports.completeTrip = async (req, res) => {
  try {
    const { bookingId, endOdometer, fuelConsumedLiters = 0, fuelExpenseAmount = 0, tollExpenses = 0, driverNotes = '' } = req.body;

    if (!bookingId || endOdometer === undefined) {
      return res.status(400).json({ success: false, message: 'Booking ID and End Odometer reading are required.' });
    }

    if (getIsConnectedToMongo()) {
      const booking = await Booking.findById(bookingId);
      if (!booking) return res.status(404).json({ success: false, message: 'Booking not found' });

      let log = await TripLog.findOne({ bookingId });
      if (!log) {
        log = new TripLog({
          bookingId,
          vehicleId: booking.assignedVehicleId,
          driverId: booking.assignedDriverId,
          startOdometer: Number(endOdometer) - 50 // fallback if start wasn't logged
        });
      }

      const totalDistance = Math.max(0, Number(endOdometer) - log.startOdometer);

      log.endOdometer = Number(endOdometer);
      log.totalDistanceKm = totalDistance;
      log.fuelConsumedLiters = Number(fuelConsumedLiters);
      log.fuelExpenseAmount = Number(fuelExpenseAmount);
      log.tollExpenses = Number(tollExpenses);
      log.driverNotes = driverNotes;
      log.completedAt = new Date();
      await log.save();

      booking.status = 'COMPLETED';
      await booking.save();

      // Update vehicle current odometer
      if (booking.assignedVehicleId) {
        await Vehicle.findByIdAndUpdate(booking.assignedVehicleId, { currentOdometer: Number(endOdometer) });
      }

      return res.status(200).json({
        success: true,
        message: 'Trip completed successfully. Log finalized.',
        tripLog: log,
        booking
      });
    } else {
      const bIdx = store.bookings.findIndex(b => b._id === bookingId || b.id === bookingId);
      if (bIdx === -1) return res.status(404).json({ success: false, message: 'Booking not found' });

      store.bookings[bIdx].status = 'COMPLETED';
      const booking = store.bookings[bIdx];

      let logIdx = store.tripLogs.findIndex(l => l.bookingId === bookingId);
      if (logIdx === -1) {
        const fallbackLog = {
          _id: `log_${Date.now()}`,
          bookingId,
          vehicleId: booking.assignedVehicleId,
          driverId: booking.assignedDriverId,
          startOdometer: Number(endOdometer) - 60,
          startedAt: new Date(Date.now() - 36000000).toISOString()
        };
        store.tripLogs.push(fallbackLog);
        logIdx = store.tripLogs.length - 1;
      }

      const startKm = store.tripLogs[logIdx].startOdometer;
      const totalKm = Math.max(0, Number(endOdometer) - startKm);

      store.tripLogs[logIdx] = {
        ...store.tripLogs[logIdx],
        endOdometer: Number(endOdometer),
        totalDistanceKm: totalKm,
        fuelConsumedLiters: Number(fuelConsumedLiters),
        fuelExpenseAmount: Number(fuelExpenseAmount),
        tollExpenses: Number(tollExpenses),
        driverNotes,
        completedAt: new Date().toISOString()
      };

      // Update vehicle odometer
      const vIdx = store.vehicles.findIndex(v => v._id === booking.assignedVehicleId);
      if (vIdx !== -1) {
        store.vehicles[vIdx].currentOdometer = Number(endOdometer);
      }

      return res.status(200).json({
        success: true,
        message: 'Trip completed successfully. Log finalized.',
        tripLog: store.tripLogs[logIdx],
        booking: store.populateBooking(booking)
      });
    }
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to complete trip', error: error.message });
  }
};
