const Booking = require('../models/Booking');
const Vehicle = require('../models/Vehicle');
const Driver = require('../models/Driver');
const TripLog = require('../models/TripLog');
const { getIsConnectedToMongo } = require('../config/db');
const store = require('../utils/dataStore');

// @desc    Get Institutional Analytics & Fleet Dashboard KPI stats
// @route   GET /api/analytics/dashboard
// @access  Private
exports.getDashboardStats = async (req, res) => {
  try {
    let bookings = [];
    let vehicles = [];
    let drivers = [];
    let tripLogs = [];

    if (getIsConnectedToMongo()) {
      bookings = await Booking.find();
      vehicles = await Vehicle.find();
      drivers = await Driver.find();
      tripLogs = await TripLog.find();
    } else {
      bookings = store.bookings;
      vehicles = store.vehicles;
      drivers = store.drivers;
      tripLogs = store.tripLogs;
    }

    const totalBookings = bookings.length;
    const pendingBookings = bookings.filter(b => b.status === 'PENDING').length;
    const approvedBookings = bookings.filter(b => b.status === 'APPROVED').length;
    const inProgressBookings = bookings.filter(b => b.status === 'IN_PROGRESS').length;
    const completedBookings = bookings.filter(b => b.status === 'COMPLETED').length;
    const rejectedBookings = bookings.filter(b => b.status === 'REJECTED').length;

    const totalVehicles = vehicles.length;
    const availableVehicles = vehicles.filter(v => v.status === 'AVAILABLE').length;
    const inTripVehicles = vehicles.filter(v => v.status === 'IN_TRIP').length;
    const maintenanceVehicles = vehicles.filter(v => v.status === 'MAINTENANCE').length;

    const totalDrivers = drivers.length;
    const availableDrivers = drivers.filter(d => d.status === 'AVAILABLE').length;

    // Fleet utilization rate
    const fleetUtilizationRate = totalVehicles > 0 
      ? Math.round(((totalVehicles - availableVehicles) / totalVehicles) * 100) 
      : 0;

    // Department Distribution
    const departmentStats = {};
    bookings.forEach(b => {
      const dept = b.department || 'Other';
      departmentStats[dept] = (departmentStats[dept] || 0) + 1;
    });

    // Trip Type Distribution
    const tripTypeStats = {};
    bookings.forEach(b => {
      const type = b.tripType || 'OTHER';
      tripTypeStats[type] = (tripTypeStats[type] || 0) + 1;
    });

    // Distance & Fuel totals
    const totalDistanceKm = tripLogs.reduce((acc, log) => acc + (log.totalDistanceKm || 0), 0);
    const totalFuelCost = tripLogs.reduce((acc, log) => acc + (log.fuelExpenseAmount || 0), 0);
    const totalTollCost = tripLogs.reduce((acc, log) => acc + (log.tollExpenses || 0), 0);

    return res.status(200).json({
      success: true,
      stats: {
        totalBookings,
        pendingBookings,
        approvedBookings,
        inProgressBookings,
        completedBookings,
        rejectedBookings,
        totalVehicles,
        availableVehicles,
        inTripVehicles,
        maintenanceVehicles,
        totalDrivers,
        availableDrivers,
        fleetUtilizationRate,
        totalDistanceKm,
        totalFuelCost,
        totalTollCost
      },
      charts: {
        departmentStats,
        tripTypeStats
      }
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to generate analytics', error: error.message });
  }
};
