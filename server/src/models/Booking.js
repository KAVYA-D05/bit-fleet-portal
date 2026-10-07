const mongoose = require('mongoose');

const passengerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  identifier: {
    type: String, // Roll No for Students, Staff ID for Faculty
    required: true,
    trim: true
  },
  type: {
    type: String,
    enum: ['STUDENT', 'FACULTY', 'STAFF', 'GUEST'],
    default: 'STUDENT'
  },
  department: {
    type: String,
    default: 'CSE'
  },
  contact: {
    type: String,
    trim: true
  },
  emergencyContact: {
    type: String,
    trim: true
  }
}, { _id: true });

const ratingSchema = new mongoose.Schema({
  driverRating: {
    type: Number,
    min: 1,
    max: 5,
    default: 5
  },
  vehicleRating: {
    type: Number,
    min: 1,
    max: 5,
    default: 5
  },
  overallRating: {
    type: Number,
    min: 1,
    max: 5,
    default: 5
  },
  remarks: {
    type: String,
    trim: true
  },
  querySuggestion: {
    type: String,
    trim: true
  },
  ratedAt: {
    type: Date
  },
  adminNotified: {
    type: Boolean,
    default: true
  },
  adminReviewed: {
    type: Boolean,
    default: false
  },
  adminActionRecommendation: {
    type: String,
    trim: true
  },
  adminActionTaken: {
    type: String,
    trim: true
  },
  reviewedAt: {
    type: Date
  }
}, { _id: false });

const financialsSchema = new mongoose.Schema({
  totalDistanceKm: {
    type: Number,
    default: 0
  },
  fuelExpense: {
    type: Number,
    default: 0
  },
  tollCharges: {
    type: Number,
    default: 0
  },
  isLongDistance: {
    type: Boolean,
    default: false
  },
  driverBataAllowance: {
    type: Number,
    default: 0
  },
  totalTripCost: {
    type: Number,
    default: 0
  }
}, { _id: false });

const bookingSchema = new mongoose.Schema({
  bookingRef: {
    type: String,
    required: true,
    unique: true,
    uppercase: true
  },
  facultyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  department: {
    type: String,
    required: true
  },
  tripType: {
    type: String,
    enum: ['OFFICIAL_VISIT', 'FIELD_TRIP', 'CONFERENCE', 'INDUSTRIAL_VISIT', 'GUEST_PICKUP', 'RESEARCH_EXPEDITION'],
    required: true
  },
  purpose: {
    type: String,
    required: [true, 'Trip purpose is required'],
    trim: true
  },
  pickupLocation: {
    type: String,
    default: 'BIT Main Gate / Admin Block',
    required: true
  },
  destination: {
    type: String,
    required: [true, 'Destination is required'],
    trim: true
  },
  departureDateTime: {
    type: Date,
    required: [true, 'Departure date and time are required']
  },
  returnDateTime: {
    type: Date,
    required: [true, 'Return date and time are required']
  },
  passengerCount: {
    type: Number,
    required: [true, 'Passenger count is required'],
    min: 1
  },
  preferredVehicleType: {
    type: String,
    enum: ['ANY', 'BUS', 'MINI_BUS', 'VAN', 'SEDAN', 'SUV'],
    default: 'ANY'
  },
  passengers: [passengerSchema],
  status: {
    type: String,
    enum: ['PENDING', 'APPROVED', 'REJECTED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED'],
    default: 'PENDING'
  },
  adminRemarks: {
    type: String,
    trim: true
  },
  cancellationReason: {
    type: String,
    trim: true
  },
  cancelledAt: {
    type: Date
  },
  cancelledBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  assignedVehicleId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Vehicle',
    default: null
  },
  assignedDriverId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Driver',
    default: null
  },
  assignedAt: {
    type: Date
  },
  approvedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  budgetCode: {
    type: String,
    default: 'BIT-DEPT-OPERATIONAL-2026'
  },
  // Trip completion rating & faculty feedback
  rating: {
    type: ratingSchema,
    default: null
  },
  // Financial calculation & Long distance allowance breakdown
  financials: {
    type: financialsSchema,
    default: () => ({})
  }
}, {
  timestamps: true
});

module.exports = mongoose.models.Booking || mongoose.model('Booking', bookingSchema);
