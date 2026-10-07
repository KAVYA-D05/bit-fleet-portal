const Vehicle = require('../models/Vehicle');
const Booking = require('../models/Booking');
const { getIsConnectedToMongo } = require('../config/db');
const store = require('../utils/dataStore');

// Preset coordinates for realistic route tracking from BIT Sathyamangalam (11.5034, 77.2774)
const BIT_CAMPUS_COORDS = { lat: 11.5034, lng: 77.2774, name: 'BIT Main Campus, Sathyamangalam' };

const DESTINATION_COORDS = {
  coimbatore: { lat: 11.0168, lng: 76.9558, name: 'Coimbatore' },
  erode: { lat: 11.3410, lng: 77.7172, name: 'Erode' },
  tiruppur: { lat: 11.1085, lng: 77.3411, name: 'Tiruppur' },
  salem: { lat: 11.6643, lng: 78.1460, name: 'Salem' },
  bangalore: { lat: 12.9716, lng: 77.5946, name: 'Bengaluru' },
  chennai: { lat: 13.0827, lng: 80.2707, name: 'Chennai' },
  ooty: { lat: 11.4102, lng: 76.6950, name: 'Ooty' },
  mysore: { lat: 12.2958, lng: 76.6394, name: 'Mysore' },
};

// @desc    Get all fleet vehicles
// @route   GET /api/vehicles
// @access  Public / Private
exports.getVehicles = async (req, res) => {
  try {
    const { type, status } = req.query;

    if (getIsConnectedToMongo()) {
      let query = {};
      if (type) query.type = type;
      if (status) query.status = status;

      const vehicles = await Vehicle.find(query).sort({ capacity: -1 });
      return res.status(200).json({ success: true, count: vehicles.length, vehicles });
    } else {
      let list = [...store.vehicles];
      if (type) list = list.filter(v => v.type === type);
      if (status) list = list.filter(v => v.status === status);

      return res.status(200).json({ success: true, count: list.length, vehicles: list });
    }
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to fetch vehicles', error: error.message });
  }
};

// @desc    Get Live GPS Telemetry for all Fleet Vehicles
// @route   GET /api/vehicles/live-locations
// @access  Private / Public
exports.getLiveLocations = async (req, res) => {
  try {
    const vehicles = await Vehicle.find().lean();
    const activeBookings = await Booking.find({
      status: { $in: ['APPROVED', 'IN_PROGRESS'] }
    })
      .populate('facultyId', 'name email department phone')
      .populate('assignedDriverId', 'name phone licenseNumber rating')
      .lean();

    const liveFleet = vehicles.map((v, index) => {
      // Find if this vehicle has an active booking
      const activeBooking = activeBookings.find(
        (b) => b.assignedVehicleId && b.assignedVehicleId.toString() === v._id.toString()
      );

      let lat = v.latitude || BIT_CAMPUS_COORDS.lat;
      let lng = v.longitude || BIT_CAMPUS_COORDS.lng;
      let speed = v.speedKmph || 0;
      let locationName = v.locationName || BIT_CAMPUS_COORDS.name;
      let status = v.status;
      let progressPercent = 0;

      // If vehicle is allocated to an active trip, compute dynamic en-route location
      if (activeBooking) {
        status = 'ON_TRIP';
        const destLower = (activeBooking.destination || '').toLowerCase();
        let target = DESTINATION_COORDS.coimbatore;

        for (const [key, coords] of Object.entries(DESTINATION_COORDS)) {
          if (destLower.includes(key)) {
            target = coords;
            break;
          }
        }

        // Realistic progression simulation (35% to 75% along route)
        const progressFactor = 0.35 + ((index * 0.17) % 0.45);
        progressPercent = Math.round(progressFactor * 100);
        lat = BIT_CAMPUS_COORDS.lat + (target.lat - BIT_CAMPUS_COORDS.lat) * progressFactor;
        lng = BIT_CAMPUS_COORDS.lng + (target.lng - BIT_CAMPUS_COORDS.lng) * progressFactor;
        speed = 52 + ((index * 7) % 18); // e.g. 52 - 68 km/h
        locationName = `En-route on NH-948 towards ${activeBooking.destination}`;
      } else if (v.status === 'AVAILABLE') {
        // At campus depot with slight offset per parking bay
        lat = BIT_CAMPUS_COORDS.lat + (index * 0.0006);
        lng = BIT_CAMPUS_COORDS.lng + ((index % 3) * 0.0008);
        speed = 0;
        locationName = `BIT Campus Depot (Bay #${index + 1})`;
      } else if (v.status === 'MAINTENANCE') {
        lat = BIT_CAMPUS_COORDS.lat - 0.0012;
        lng = BIT_CAMPUS_COORDS.lng + 0.0015;
        speed = 0;
        locationName = 'BIT Central Mechanical Workshop & Service Bay';
      }

      return {
        _id: v._id,
        id: v._id,
        registrationNumber: v.registrationNumber,
        model: v.model,
        type: v.type,
        capacity: v.capacity,
        fuelType: v.fuelType,
        fuelPercent: v.fuelPercent || (75 + (index * 4) % 25),
        currentOdometer: v.currentOdometer,
        status,
        speedKmph: speed,
        heading: (index * 45 + 30) % 360,
        latitude: lat,
        longitude: lng,
        locationName,
        isGpsActive: true,
        lastGpsUpdate: new Date().toISOString(),
        progressPercent,
        activeBooking: activeBooking ? {
          _id: activeBooking._id,
          bookingRef: activeBooking.bookingRef,
          destination: activeBooking.destination,
          tripType: activeBooking.tripType,
          purpose: activeBooking.purpose,
          passengerCount: activeBooking.passengerCount,
          faculty: activeBooking.facultyId,
          driver: activeBooking.assignedDriverId,
          departureDateTime: activeBooking.departureDateTime,
          returnDateTime: activeBooking.returnDateTime
        } : null
      };
    });

    return res.status(200).json({
      success: true,
      count: liveFleet.length,
      campusCenter: BIT_CAMPUS_COORDS,
      vehicles: liveFleet
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve live fleet GPS coordinates',
      error: error.message
    });
  }
};

// @desc    Add new vehicle to fleet
// @route   POST /api/vehicles
// @access  Private (Admin only)
exports.addVehicle = async (req, res) => {
  try {
    const { registrationNumber, model, type, capacity, fuelType, currentOdometer, fuelEfficiencyKmpl } = req.body;

    if (!registrationNumber || !model || !type || !capacity) {
      return res.status(400).json({ success: false, message: 'Registration number, model, type, and capacity are required.' });
    }

    const newVehicleData = {
      registrationNumber: registrationNumber.toUpperCase().trim(),
      model,
      type,
      capacity: Number(capacity),
      fuelType: fuelType || 'DIESEL',
      status: 'AVAILABLE',
      currentOdometer: Number(currentOdometer) || 0,
      fuelEfficiencyKmpl: Number(fuelEfficiencyKmpl) || 12.0,
      latitude: BIT_CAMPUS_COORDS.lat,
      longitude: BIT_CAMPUS_COORDS.lng,
      locationName: 'BIT Main Campus Depot, Sathyamangalam',
      isGpsActive: true,
      lastGpsUpdate: new Date()
    };

    const vehicle = await Vehicle.create(newVehicleData);
    return res.status(201).json({ success: true, message: 'Vehicle added to BIT fleet successfully', vehicle });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to add vehicle', error: error.message });
  }
};

// @desc    Update vehicle status / service
// @route   PUT /api/vehicles/:id
// @access  Private (Admin only)
exports.updateVehicle = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const vehicle = await Vehicle.findByIdAndUpdate(id, updates, { new: true });
    if (!vehicle) return res.status(404).json({ success: false, message: 'Vehicle not found' });

    return res.status(200).json({ success: true, vehicle });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to update vehicle', error: error.message });
  }
};

// @desc    Update vehicle live GPS coordinates from driver app or IoT tracker
// @route   PUT /api/vehicles/:id/location
// @access  Private / Public
exports.updateGpsLocation = async (req, res) => {
  try {
    const { id } = req.params;
    const { latitude, longitude, speedKmph, heading, locationName } = req.body;

    const vehicle = await Vehicle.findByIdAndUpdate(
      id,
      {
        latitude: Number(latitude),
        longitude: Number(longitude),
        speedKmph: Number(speedKmph) || 0,
        heading: Number(heading) || 0,
        locationName: locationName || 'En-route',
        lastGpsUpdate: new Date(),
        isGpsActive: true
      },
      { new: true }
    );

    if (!vehicle) return res.status(404).json({ success: false, message: 'Vehicle not found' });

    return res.status(200).json({ success: true, message: 'GPS coordinates updated', vehicle });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to update GPS location', error: error.message });
  }
};
