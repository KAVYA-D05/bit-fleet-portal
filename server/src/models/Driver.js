const mongoose = require('mongoose');

const driverSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Driver name is required'],
    trim: true
  },
  licenseNumber: {
    type: String,
    required: [true, 'License number is required'],
    unique: true,
    trim: true,
    uppercase: true
  },
  licenseCategory: {
    type: String,
    enum: ['LMV', 'HMV', 'BUS_TRANS', 'ALL'],
    default: 'ALL'
  },
  phone: {
    type: String,
    required: [true, 'Phone number is required'],
    trim: true
  },
  status: {
    type: String,
    enum: ['AVAILABLE', 'ON_DUTY', 'LEAVE', 'INACTIVE'],
    default: 'AVAILABLE'
  },
  experienceYears: {
    type: Number,
    default: 5
  },
  rating: {
    type: Number,
    default: 4.8
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  healthMetrics: {
    heartRateBpm: {
      type: Number,
      default: 74
    },
    bloodPressure: {
      type: String,
      default: '120/80 mmHg'
    },
    systolicBp: {
      type: Number,
      default: 120
    },
    diastolicBp: {
      type: Number,
      default: 80
    },
    spo2Percent: {
      type: Number,
      default: 98
    },
    bodyTempC: {
      type: Number,
      default: 36.6
    },
    alertnessPercent: {
      type: Number,
      default: 96
    },
    continuousDrivingMins: {
      type: Number,
      default: 85
    },
    fatigueLevel: {
      type: String,
      enum: ['NORMAL', 'LOW_FATIGUE', 'HIGH_FATIGUE_ALERT'],
      default: 'NORMAL'
    },
    healthStatus: {
      type: String,
      enum: ['FIT_TO_DRIVE', 'CAUTION_REST_RECOMMENDED', 'CRITICAL_ALERT'],
      default: 'FIT_TO_DRIVE'
    },
    bloodGroup: {
      type: String,
      default: 'O+'
    },
    emergencyContact: {
      type: String,
      default: '+91 98420 11001'
    },
    lastHealthCheckAt: {
      type: Date,
      default: Date.now
    }
  }
}, {
  timestamps: true
});

module.exports = mongoose.models.Driver || mongoose.model('Driver', driverSchema);
