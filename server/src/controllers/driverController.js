const Driver = require('../models/Driver');
const Booking = require('../models/Booking');
const { getIsConnectedToMongo } = require('../config/db');
const store = require('../utils/dataStore');

// @desc    Get all drivers
// @route   GET /api/drivers
// @access  Public / Private
exports.getDrivers = async (req, res) => {
  try {
    const { status } = req.query;

    if (getIsConnectedToMongo()) {
      let query = {};
      if (status) query.status = status;
      const drivers = await Driver.find(query).sort({ name: 1 });
      return res.status(200).json({ success: true, count: drivers.length, drivers });
    } else {
      let list = [...store.drivers];
      if (status) list = list.filter(d => d.status === status);
      return res.status(200).json({ success: true, count: list.length, drivers: list });
    }
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to fetch drivers', error: error.message });
  }
};

// @desc    Add new driver to roster
// @route   POST /api/drivers
// @access  Private (Admin only)
exports.addDriver = async (req, res) => {
  try {
    const { name, licenseNumber, licenseCategory, phone, experienceYears } = req.body;

    if (!name || !licenseNumber || !phone) {
      return res.status(400).json({ success: false, message: 'Name, license number, and phone are required.' });
    }

    const newDriverData = {
      _id: `drv_${Date.now()}`,
      name,
      licenseNumber: licenseNumber.toUpperCase().trim(),
      licenseCategory: licenseCategory || 'ALL',
      phone,
      status: 'AVAILABLE',
      experienceYears: Number(experienceYears) || 3,
      rating: 4.8
    };

    if (getIsConnectedToMongo()) {
      const driver = await Driver.create(newDriverData);
      return res.status(201).json({ success: true, message: 'Driver added to roster', driver });
    } else {
      store.drivers.push(newDriverData);
      return res.status(201).json({ success: true, message: 'Driver added to roster', driver: newDriverData });
    }
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to add driver', error: error.message });
  }
};

// @desc    Get trips assigned to specific driver
// @route   GET /api/drivers/my-trips
// @access  Private (Driver role)
exports.getMyAssignedTrips = async (req, res) => {
  try {
    const userId = req.user._id || req.user.id;
    let driverObj = store.drivers.find(d => d.userId === userId);
    
    // If not found by userId, pick driver by name or first available
    if (!driverObj) {
      driverObj = store.drivers.find(d => d.name.toLowerCase().includes(req.user.name.toLowerCase().split(' ')[0]));
    }

    if (!driverObj) {
      driverObj = store.drivers[0];
    }

    let trips = store.bookings
      .filter(b => b.assignedDriverId === driverObj._id)
      .map(b => store.populateBooking(b))
      .sort((a, b) => new Date(a.departureDateTime) - new Date(b.departureDateTime));

    return res.status(200).json({
      success: true,
      driver: driverObj,
      trips
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to fetch driver trips', error: error.message });
  }
};
