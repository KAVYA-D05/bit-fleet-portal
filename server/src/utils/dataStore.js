const bcrypt = require('bcryptjs');

// In-Memory & Persistent fallback store for zero-config out-of-the-box operation
class DataStore {
  constructor() {
    this.users = [];
    this.vehicles = [];
    this.drivers = [];
    this.bookings = [];
    this.tripLogs = [];
    this.isInitialized = false;
    this.initDefaultData();
  }

  initDefaultData() {
    if (this.isInitialized) return;

    const salt = bcrypt.genSaltSync(10);
    const defaultPasswordHash = bcrypt.hashSync('bit12345', salt);

    // 1. Pre-seeded Users
    this.users = [
      {
        _id: 'usr_admin_1',
        name: 'Mr. Senthil Nathan',
        email: 'transport.admin@bitsathy.ac.in',
        password: defaultPasswordHash,
        role: 'ADMIN',
        department: 'TRANSPORT',
        employeeId: 'BIT-TR-001',
        phone: '+91 98420 11001',
        designation: 'Chief Transport Officer & Fleet Manager',
        createdAt: new Date('2026-01-01')
      },
      {
        _id: 'usr_faculty_1',
        name: 'Dr. Rajesh Kumar',
        email: 'rajeshkumar@bitsathy.ac.in',
        password: defaultPasswordHash,
        role: 'FACULTY',
        department: 'CSE',
        employeeId: 'BIT-CSE-402',
        phone: '+91 94432 55210',
        designation: 'Professor & Head - Data Science',
        createdAt: new Date('2026-01-10')
      },
      {
        _id: 'usr_faculty_2',
        name: 'Dr. Priya Venkatesh',
        email: 'priyav@bitsathy.ac.in',
        password: defaultPasswordHash,
        role: 'FACULTY',
        department: 'ECE',
        employeeId: 'BIT-ECE-315',
        phone: '+91 98941 77332',
        designation: 'Associate Professor',
        createdAt: new Date('2026-01-15')
      },
      {
        _id: 'usr_faculty_3',
        name: 'Prof. Anand Shanmugam',
        email: 'anands@bitsathy.ac.in',
        password: defaultPasswordHash,
        role: 'FACULTY',
        department: 'MECH',
        employeeId: 'BIT-MEC-208',
        phone: '+91 97890 33412',
        designation: 'Assistant Professor (Sr. Gr)',
        createdAt: new Date('2026-02-01')
      },
      {
        _id: 'usr_driver_1',
        name: 'Murugan K',
        email: 'murugan.driver@bitsathy.ac.in',
        password: defaultPasswordHash,
        role: 'DRIVER',
        department: 'TRANSPORT',
        employeeId: 'BIT-DRV-101',
        phone: '+91 98433 66101',
        designation: 'Senior Heavy Vehicle Operator',
        createdAt: new Date('2026-01-01')
      },
      {
        _id: 'usr_driver_2',
        name: 'Ramesh P',
        email: 'ramesh.driver@bitsathy.ac.in',
        password: defaultPasswordHash,
        role: 'DRIVER',
        department: 'TRANSPORT',
        employeeId: 'BIT-DRV-102',
        phone: '+91 98433 66102',
        designation: 'Fleet Driver',
        createdAt: new Date('2026-01-01')
      },
      {
        _id: 'usr_driver_3',
        name: 'Selvam M',
        email: 'selvam.driver@bitsathy.ac.in',
        password: defaultPasswordHash,
        role: 'DRIVER',
        department: 'TRANSPORT',
        employeeId: 'BIT-DRV-103',
        phone: '+91 98433 66103',
        designation: 'VIP / Executive Chauffeur',
        createdAt: new Date('2026-01-01')
      }
    ];

    // 2. Pre-seeded Drivers
    this.drivers = [
      {
        _id: 'drv_1',
        userId: 'usr_driver_1',
        name: 'Murugan K',
        licenseNumber: 'TN-37-20100004521',
        licenseCategory: 'HMV',
        phone: '+91 98433 66101',
        status: 'AVAILABLE',
        experienceYears: 14,
        rating: 4.9
      },
      {
        _id: 'drv_2',
        userId: 'usr_driver_2',
        name: 'Ramesh P',
        licenseNumber: 'TN-37-20150008892',
        licenseCategory: 'ALL',
        phone: '+91 98433 66102',
        status: 'AVAILABLE',
        experienceYears: 8,
        rating: 4.7
      },
      {
        _id: 'drv_3',
        userId: 'usr_driver_3',
        name: 'Selvam M',
        licenseNumber: 'TN-37-20180001290',
        licenseCategory: 'LMV',
        phone: '+91 98433 66103',
        status: 'AVAILABLE',
        experienceYears: 6,
        rating: 4.8
      }
    ];

    // 3. Pre-seeded Vehicles
    this.vehicles = [
      {
        _id: 'veh_1',
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
        _id: 'veh_2',
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
        _id: 'veh_3',
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
        _id: 'veh_4',
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
        _id: 'veh_5',
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
        _id: 'veh_6',
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
        _id: 'veh_7',
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
        _id: 'veh_8',
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
    ];

    // 4. Pre-seeded Bookings
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(8, 30, 0, 0);

    const tomorrowEnd = new Date(tomorrow);
    tomorrowEnd.setHours(18, 0, 0, 0);

    const dayAfter = new Date();
    dayAfter.setDate(dayAfter.getDate() + 2);
    dayAfter.setHours(9, 0, 0, 0);

    const dayAfterEnd = new Date(dayAfter);
    dayAfterEnd.setHours(17, 30, 0, 0);

    this.bookings = [
      {
        _id: 'bk_1',
        bookingRef: 'BIT-FLT-2026-001',
        facultyId: 'usr_faculty_1',
        department: 'CSE',
        tripType: 'FIELD_TRIP',
        purpose: 'Industrial Field Visit to Infosys & Bosch Tech Park Coimbatore for Final Year AI & DS Students',
        pickupLocation: 'BIT Main Gate',
        destination: 'Infosys SEZ, Keeranatham, Coimbatore',
        departureDateTime: tomorrow.toISOString(),
        returnDateTime: tomorrowEnd.toISOString(),
        passengerCount: 45,
        preferredVehicleType: 'BUS',
        status: 'APPROVED',
        adminRemarks: 'Approved for 45 students with 2 accompanying faculty members. Starbus 50S allocated.',
        assignedVehicleId: 'veh_1',
        assignedDriverId: 'drv_1',
        assignedAt: new Date().toISOString(),
        approvedBy: 'usr_admin_1',
        passengers: [
          { name: 'Kavya S', identifier: '7376221CS101', type: 'STUDENT', department: 'CSE', contact: '9840112233', emergencyContact: '9840112230' },
          { name: 'Arun Prasath M', identifier: '7376221CS102', type: 'STUDENT', department: 'CSE', contact: '9840112234', emergencyContact: '9840112231' },
          { name: 'Dinesh Kumar K', identifier: '7376221CS103', type: 'STUDENT', department: 'CSE', contact: '9840112235', emergencyContact: '9840112232' },
          { name: 'Dr. Rajesh Kumar', identifier: 'BIT-CSE-402', type: 'FACULTY', department: 'CSE', contact: '9443255210', emergencyContact: '9443255219' }
        ],
        createdAt: new Date(Date.now() - 86400000).toISOString()
      },
      {
        _id: 'bk_2',
        bookingRef: 'BIT-FLT-2026-002',
        facultyId: 'usr_faculty_2',
        department: 'ECE',
        tripType: 'CONFERENCE',
        purpose: 'IEEE International Conference Paper Presentation at IISc Bangalore',
        pickupLocation: 'BIT Admin Block Front Porch',
        destination: 'IISc Bangalore Main Campus',
        departureDateTime: dayAfter.toISOString(),
        returnDateTime: dayAfterEnd.toISOString(),
        passengerCount: 4,
        preferredVehicleType: 'SUV',
        status: 'PENDING',
        adminRemarks: '',
        assignedVehicleId: null,
        assignedDriverId: null,
        passengers: [
          { name: 'Dr. Priya Venkatesh', identifier: 'BIT-ECE-315', type: 'FACULTY', department: 'ECE', contact: '9894177332', emergencyContact: '9894177339' },
          { name: 'Sathish R', identifier: '7376211EC204', type: 'STUDENT', department: 'ECE', contact: '9788114422', emergencyContact: '9788114429' }
        ],
        createdAt: new Date().toISOString()
      },
      {
        _id: 'bk_3',
        bookingRef: 'BIT-FLT-2026-003',
        facultyId: 'usr_faculty_3',
        department: 'MECH',
        tripType: 'OFFICIAL_VISIT',
        purpose: 'Anna University Academic Council Delegation Meeting & Research Review',
        pickupLocation: 'BIT Guest House',
        destination: 'Anna University Guindy Campus, Chennai',
        departureDateTime: new Date(Date.now() - 172800000).toISOString(),
        returnDateTime: new Date(Date.now() - 86400000).toISOString(),
        passengerCount: 3,
        preferredVehicleType: 'SEDAN',
        status: 'COMPLETED',
        adminRemarks: 'Official trip successfully executed.',
        assignedVehicleId: 'veh_7',
        assignedDriverId: 'drv_3',
        passengers: [
          { name: 'Prof. Anand Shanmugam', identifier: 'BIT-MEC-208', type: 'FACULTY', department: 'MECH', contact: '9789033412', emergencyContact: '9789033419' }
        ],
        createdAt: new Date(Date.now() - 259200000).toISOString()
      }
    ];

    // 5. Pre-seeded Trip Log
    this.tripLogs = [
      {
        _id: 'log_1',
        bookingId: 'bk_3',
        vehicleId: 'veh_7',
        driverId: 'drv_3',
        startOdometer: 37620,
        endOdometer: 38200,
        totalDistanceKm: 580,
        fuelConsumedLiters: 32.5,
        fuelExpenseAmount: 3412.50,
        tollExpenses: 780,
        driverNotes: 'Smooth journey. Fuel topped up at Salem bypass.',
        startedAt: new Date(Date.now() - 172800000).toISOString(),
        completedAt: new Date(Date.now() - 86400000).toISOString()
      }
    ];

    this.isInitialized = true;
    console.log('[DataStore] Loaded pre-seeded BIT Data: 7 Users, 8 Fleet Vehicles, 3 Drivers, 3 Bookings.');
  }

  // Populate helper
  populateBooking(booking) {
    if (!booking) return null;
    const requester = this.users.find(u => u._id === booking.facultyId);
    const vehicle = this.vehicles.find(v => v._id === booking.assignedVehicleId);
    const driver = this.drivers.find(d => d._id === booking.assignedDriverId);
    const approver = this.users.find(u => u._id === booking.approvedBy);
    const tripLog = this.tripLogs.find(l => l.bookingId === booking._id);

    return {
      ...booking,
      faculty: requester ? { _id: requester._id, name: requester.name, email: requester.email, department: requester.department, phone: requester.phone, employeeId: requester.employeeId } : null,
      assignedVehicle: vehicle || null,
      assignedDriver: driver || null,
      approver: approver ? { _id: approver._id, name: approver.name } : null,
      tripLog: tripLog || null
    };
  }
}

const store = new DataStore();

module.exports = store;
