const mongoose = require('mongoose');

const vehicleSchema = new mongoose.Schema({
  registrationNumber: {
    type: String,
    required: [true, 'Registration number is required'],
    unique: true,
    trim: true,
    uppercase: true
  },
  model: {
    type: String,
    required: [true, 'Vehicle model is required'],
    trim: true
  },
  type: {
    type: String,
    enum: ['BUS', 'MINI_BUS', 'VAN', 'SEDAN', 'SUV'],
    required: [true, 'Vehicle type is required']
  },
  capacity: {
    type: Number,
    required: [true, 'Seating capacity is required'],
    min: 1
  },
  fuelType: {
    type: String,
    enum: ['DIESEL', 'PETROL', 'ELECTRIC', 'CNG'],
    default: 'DIESEL'
  },
  status: {
    type: String,
    enum: ['AVAILABLE', 'IN_TRIP', 'MAINTENANCE', 'INACTIVE'],
    default: 'AVAILABLE'
  },
  currentOdometer: {
    type: Number,
    default: 0
  },
  insuranceExpiry: {
    type: Date
  },
  pollutionExpiry: {
    type: Date
  },
  fitnessExpiry: {
    type: Date
  },
  assignedDriverId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Driver',
    default: null
  },
  fuelEfficiencyKmpl: {
    type: Number,
    default: 12.0
  },
  // GPS Telemetry Fields
  latitude: {
    type: Number,
    default: 11.5034 // BIT Sathyamangalam Main Campus
  },
  longitude: {
    type: Number,
    default: 77.2774
  },
  speedKmph: {
    type: Number,
    default: 0
  },
  heading: {
    type: Number,
    default: 90
  },
  locationName: {
    type: String,
    default: 'BIT Main Campus Depot, Sathyamangalam'
  },
  isGpsActive: {
    type: Boolean,
    default: true
  },
  lastGpsUpdate: {
    type: Date,
    default: Date.now
  },
  fuelPercent: {
    type: Number,
    default: 88
  }
}, {
  timestamps: true
});

module.exports = mongoose.models.Vehicle || mongoose.model('Vehicle', vehicleSchema);
