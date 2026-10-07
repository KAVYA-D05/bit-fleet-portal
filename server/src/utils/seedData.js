const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');

dotenv.config();

const User = require('../models/User');
const Vehicle = require('../models/Vehicle');
const Driver = require('../models/Driver');
const Booking = require('../models/Booking');
const TripLog = require('../models/TripLog');

const seedDatabase = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/bit_fleet_portal';
    await mongoose.connect(mongoUri);
    console.log(`[MongoDB Seed] Connected to ${mongoUri}`);

    // Clear existing data for fresh seed
    await Promise.all([
      User.deleteMany({}),
      Vehicle.deleteMany({}),
      Driver.deleteMany({}),
      Booking.deleteMany({}),
      TripLog.deleteMany({})
    ]);
    console.log('[MongoDB Seed] Cleared existing collections.');

    // 1. Seed Users
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash('bit12345', salt);

    const users = await User.create([
      {
        name: 'Mr. Senthil Nathan',
        email: 'transport.admin@bitsathy.ac.in',
        password: passwordHash,
        role: 'ADMIN',
        department: 'TRANSPORT',
        employeeId: 'BIT-TR-001',
        phone: '+91 98420 11001',
        designation: 'Chief Transport Officer & Fleet Manager'
      },
      {
        name: 'Dr. Rajesh Kumar',
        email: 'rajeshkumar@bitsathy.ac.in',
        password: passwordHash,
        role: 'FACULTY',
        department: 'CSE',
        employeeId: 'BIT-CSE-402',
        phone: '+91 94432 55210',
        designation: 'Professor & Head - Data Science'
      },
      {
        name: 'Dr. Priya Venkatesh',
        email: 'priyav@bitsathy.ac.in',
        password: passwordHash,
        role: 'FACULTY',
        department: 'ECE',
        employeeId: 'BIT-ECE-315',
        phone: '+91 98941 77332',
        designation: 'Associate Professor'
      },
      {
        name: 'Prof. Anand Shanmugam',
        email: 'anands@bitsathy.ac.in',
        password: passwordHash,
        role: 'FACULTY',
        department: 'MECH',
        employeeId: 'BIT-MEC-208',
        phone: '+91 97890 33412',
        designation: 'Assistant Professor (Sr. Gr)'
      },
      {
        name: 'Murugan K',
        email: 'murugan.driver@bitsathy.ac.in',
        password: passwordHash,
        role: 'DRIVER',
        department: 'TRANSPORT',
        employeeId: 'BIT-DRV-101',
        phone: '+91 98433 66101',
        designation: 'Senior Heavy Fleet Operator'
      },
      {
        name: 'Ramesh P',
        email: 'ramesh.driver@bitsathy.ac.in',
        password: passwordHash,
        role: 'DRIVER',
        department: 'TRANSPORT',
        employeeId: 'BIT-DRV-102',
        phone: '+91 98433 66102',
        designation: 'Fleet Driver'
      },
      {
        name: 'Selvam M',
        email: 'selvam.driver@bitsathy.ac.in',
        password: passwordHash,
        role: 'DRIVER',
        department: 'TRANSPORT',
        employeeId: 'BIT-DRV-103',
        phone: '+91 98433 66103',
        designation: 'VIP / Executive Chauffeur'
      }
    ]);
    console.log(`[MongoDB Seed] Inserted ${users.length} Users`);

    const adminUser = users.find(u => u.role === 'ADMIN');
    const facultyUser1 = users.find(u => u.email === 'rajeshkumar@bitsathy.ac.in');
    const facultyUser2 = users.find(u => u.email === 'priyav@bitsathy.ac.in');
    const driverUser1 = users.find(u => u.email === 'murugan.driver@bitsathy.ac.in');
    const driverUser2 = users.find(u => u.email === 'ramesh.driver@bitsathy.ac.in');
    const driverUser3 = users.find(u => u.email === 'selvam.driver@bitsathy.ac.in');

    // 2. Seed Drivers
    const drivers = await Driver.create([
      {
        userId: driverUser1._id,
        name: 'Murugan K',
        licenseNumber: 'TN-37-20100004521',
        licenseCategory: 'HMV',
        phone: '+91 98433 66101',
        status: 'AVAILABLE',
        experienceYears: 14,
        rating: 4.9
      },
      {
        userId: driverUser2._id,
        name: 'Ramesh P',
        licenseNumber: 'TN-37-20150008892',
        licenseCategory: 'ALL',
        phone: '+91 98433 66102',
        status: 'AVAILABLE',
        experienceYears: 8,
        rating: 4.7
      },
      {
        userId: driverUser3._id,
        name: 'Selvam M',
        licenseNumber: 'TN-37-20180001290',
        licenseCategory: 'LMV',
        phone: '+91 98433 66103',
        status: 'AVAILABLE',
        experienceYears: 6,
        rating: 4.8
      }
    ]);
    console.log(`[MongoDB Seed] Inserted ${drivers.length} Drivers`);

    // 3. Seed Vehicles
    const vehicles = await Vehicle.create([
      {
        registrationNumber: 'TN-37-BT-1001',
        model: 'Tata Starbus 50S (Ultra AC)',
        type: 'BUS',
        capacity: 50,
        fuelType: 'DIESEL',
        status: 'AVAILABLE',
        currentOdometer: 64200,
        insuranceExpiry: new Date('2027-03-31'),
        fuelEfficiencyKmpl: 5.5
      },
      {
        registrationNumber: 'TN-37-BT-1002',
        model: 'Ashok Leyland Sunshine Standard',
        type: 'BUS',
        capacity: 40,
        fuelType: 'DIESEL',
        status: 'AVAILABLE',
        currentOdometer: 48900,
        insuranceExpiry: new Date('2026-11-30'),
        fuelEfficiencyKmpl: 6.0
      },
      {
        registrationNumber: 'TN-37-BT-2005',
        model: 'Force Traveller 3350 Super',
        type: 'MINI_BUS',
        capacity: 26,
        fuelType: 'DIESEL',
        status: 'AVAILABLE',
        currentOdometer: 31200,
        insuranceExpiry: new Date('2027-01-15'),
        fuelEfficiencyKmpl: 9.5
      },
      {
        registrationNumber: 'TN-37-BT-3012',
        model: 'Force Urbania Luxury Van',
        type: 'VAN',
        capacity: 16,
        fuelType: 'DIESEL',
        status: 'AVAILABLE',
        currentOdometer: 18450,
        insuranceExpiry: new Date('2027-06-20'),
        fuelEfficiencyKmpl: 10.5
      },
      {
        registrationNumber: 'TN-37-BT-4050',
        model: 'Toyota Innova Crysta ZX',
        type: 'SUV',
        capacity: 7,
        fuelType: 'DIESEL',
        status: 'AVAILABLE',
        currentOdometer: 42100,
        insuranceExpiry: new Date('2026-12-10'),
        fuelEfficiencyKmpl: 13.0
      },
      {
        registrationNumber: 'TN-37-BT-4088',
        model: 'Mahindra Scorpio-N Z8L',
        type: 'SUV',
        capacity: 7,
        fuelType: 'DIESEL',
        status: 'MAINTENANCE',
        currentOdometer: 29500,
        insuranceExpiry: new Date('2027-04-18'),
        fuelEfficiencyKmpl: 12.0
      },
      {
        registrationNumber: 'TN-37-BT-5021',
        model: 'Maruti Suzuki Dzire VXi',
        type: 'SEDAN',
        capacity: 5,
        fuelType: 'PETROL',
        status: 'AVAILABLE',
        currentOdometer: 38200,
        insuranceExpiry: new Date('2026-10-05'),
        fuelEfficiencyKmpl: 18.5
      },
      {
        registrationNumber: 'TN-37-BT-5099',
        model: 'Tata Tigor EV Electric Sedan',
        type: 'SEDAN',
        capacity: 5,
        fuelType: 'ELECTRIC',
        status: 'AVAILABLE',
        currentOdometer: 14200,
        insuranceExpiry: new Date('2027-08-30'),
        fuelEfficiencyKmpl: 0.0
      }
    ]);
    console.log(`[MongoDB Seed] Inserted ${vehicles.length} Vehicles`);

    // 4. Seed Bookings
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(8, 30, 0, 0);

    const tomorrowEnd = new Date(tomorrow);
    tomorrowEnd.setHours(18, 0, 0, 0);

    const bookings = await Booking.create([
      {
        bookingRef: 'BIT-FLT-2026-001',
        facultyId: facultyUser1._id,
        department: 'CSE',
        tripType: 'FIELD_TRIP',
        purpose: 'Industrial Field Visit to Infosys & Bosch Tech Park Coimbatore for Final Year AI & DS Students',
        pickupLocation: 'BIT Main Gate',
        destination: 'Infosys SEZ, Keeranatham, Coimbatore',
        departureDateTime: tomorrow,
        returnDateTime: tomorrowEnd,
        passengerCount: 45,
        preferredVehicleType: 'BUS',
        status: 'APPROVED',
        adminRemarks: 'Approved for 45 students with 2 accompanying faculty members. Starbus 50S allocated.',
        assignedVehicleId: vehicles[0]._id,
        assignedDriverId: drivers[0]._id,
        assignedAt: new Date(),
        approvedBy: adminUser._id,
        passengers: [
          { name: 'Kavya S', identifier: '7376221CS101', type: 'STUDENT', department: 'CSE', contact: '9840112233', emergencyContact: '9840112230' },
          { name: 'Arun Prasath M', identifier: '7376221CS102', type: 'STUDENT', department: 'CSE', contact: '9840112234', emergencyContact: '9840112231' },
          { name: 'Dinesh Kumar K', identifier: '7376221CS103', type: 'STUDENT', department: 'CSE', contact: '9840112235', emergencyContact: '9840112232' },
          { name: 'Dr. Rajesh Kumar', identifier: 'BIT-CSE-402', type: 'FACULTY', department: 'CSE', contact: '9443255210', emergencyContact: '9443255219' }
        ]
      },
      {
        bookingRef: 'BIT-FLT-2026-002',
        facultyId: facultyUser2._id,
        department: 'ECE',
        tripType: 'CONFERENCE',
        purpose: 'IEEE International Conference Paper Presentation at IISc Bangalore',
        pickupLocation: 'BIT Admin Block Front Porch',
        destination: 'IISc Bangalore Main Campus',
        departureDateTime: new Date(Date.now() + 172800000),
        returnDateTime: new Date(Date.now() + 201600000),
        passengerCount: 4,
        preferredVehicleType: 'SUV',
        status: 'PENDING',
        adminRemarks: '',
        passengers: [
          { name: 'Dr. Priya Venkatesh', identifier: 'BIT-ECE-315', type: 'FACULTY', department: 'ECE', contact: '9894177332', emergencyContact: '9894177339' },
          { name: 'Sathish R', identifier: '7376211EC204', type: 'STUDENT', department: 'ECE', contact: '9788114422', emergencyContact: '9788114429' }
        ]
      }
    ]);
    console.log(`[MongoDB Seed] Inserted ${bookings.length} Bookings`);

    console.log('\n==================================================');
    console.log('🎉 MONGODB DATABASE SEED COMPLETED SUCCESSFULLY!');
    console.log('==================================================\n');

    process.exit(0);
  } catch (error) {
    console.error('MongoDB Seed Error:', error);
    process.exit(1);
  }
};

seedDatabase();
