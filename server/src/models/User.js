const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: 6
  },
  role: {
    type: String,
    enum: ['FACULTY', 'ADMIN', 'DRIVER'],
    default: 'FACULTY'
  },
  department: {
    type: String,
    enum: ['CSE', 'ECE', 'MECH', 'CIVIL', 'IT', 'AI&DS', 'BIOTECH', 'EEE', 'MANAGEMENT', 'TRANSPORT'],
    default: 'CSE'
  },
  employeeId: {
    type: String,
    trim: true
  },
  phone: {
    type: String,
    trim: true
  },
  designation: {
    type: String,
    default: 'Assistant Professor'
  }
}, {
  timestamps: true
});

module.exports = mongoose.models.User || mongoose.model('User', userSchema);
