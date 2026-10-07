const mongoose = require('mongoose');

const tripLogSchema = new mongoose.Schema({
  bookingId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Booking',
    required: true,
    unique: true
  },
  vehicleId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Vehicle',
    required: true
  },
  driverId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Driver',
    required: true
  },
  startOdometer: {
    type: Number,
    required: true
  },
  endOdometer: {
    type: Number
  },
  totalDistanceKm: {
    type: Number
  },
  fuelConsumedLiters: {
    type: Number,
    default: 0
  },
  fuelExpenseAmount: {
    type: Number,
    default: 0
  },
  tollExpenses: {
    type: Number,
    default: 0
  },
  driverNotes: {
    type: String,
    trim: true
  },
  startedAt: {
    type: Date,
    default: Date.now
  },
  completedAt: {
    type: Date
  }
}, {
  timestamps: true
});

module.exports = mongoose.models.TripLog || mongoose.model('TripLog', tripLogSchema);
