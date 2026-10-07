// Client-side fallback storage to guarantee 100% functionality even if backend server is offline

export const MOCK_PERSONAS = [
  {
    id: 'usr_faculty_1',
    name: 'Dr. Rajesh Kumar',
    email: 'rajeshkumar@bitsathy.ac.in',
    role: 'FACULTY',
    department: 'CSE',
    employeeId: 'BIT-CSE-402',
    phone: '+91 94432 55210',
    designation: 'Professor & Head - Data Science'
  },
  {
    id: 'usr_admin_1',
    name: 'Mr. Senthil Nathan',
    email: 'transport.admin@bitsathy.ac.in',
    role: 'ADMIN',
    department: 'TRANSPORT',
    employeeId: 'BIT-TR-001',
    phone: '+91 98420 11001',
    designation: 'Chief Transport Officer & Fleet Manager'
  },
  {
    id: 'usr_driver_1',
    name: 'Murugan K',
    email: 'murugan.driver@bitsathy.ac.in',
    role: 'DRIVER',
    department: 'TRANSPORT',
    employeeId: 'BIT-DRV-101',
    phone: '+91 98433 66101',
    designation: 'Senior Heavy Fleet Operator'
  }
];

export const MOCK_VEHICLES = [
  {
    _id: 'veh_1',
    registrationNumber: 'TN-37-BT-1001',
    model: 'Tata Starbus 50S (Ultra AC)',
    type: 'BUS',
    capacity: 50,
    fuelType: 'DIESEL',
    status: 'AVAILABLE',
    currentOdometer: 64200,
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
    fuelEfficiencyKmpl: 0.0
  }
];

export const MOCK_DRIVERS = [
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

export const getInitialBookings = () => {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  tomorrow.setHours(8, 30, 0, 0);

  const tomorrowEnd = new Date(tomorrow);
  tomorrowEnd.setHours(18, 0, 0, 0);

  return [
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
      faculty: MOCK_PERSONAS[0],
      assignedVehicle: MOCK_VEHICLES[0],
      assignedDriver: MOCK_DRIVERS[0],
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
      facultyId: 'usr_faculty_1',
      department: 'ECE',
      tripType: 'CONFERENCE',
      purpose: 'IEEE International Conference Paper Presentation at IISc Bangalore',
      pickupLocation: 'BIT Admin Block Front Porch',
      destination: 'IISc Bangalore Main Campus',
      departureDateTime: new Date(Date.now() + 172800000).toISOString(),
      returnDateTime: new Date(Date.now() + 201600000).toISOString(),
      passengerCount: 4,
      preferredVehicleType: 'SUV',
      status: 'PENDING',
      adminRemarks: '',
      faculty: MOCK_PERSONAS[0],
      assignedVehicle: null,
      assignedDriver: null,
      passengers: [
        { name: 'Dr. Priya Venkatesh', identifier: 'BIT-ECE-315', type: 'FACULTY', department: 'ECE', contact: '9894177332', emergencyContact: '9894177339' },
        { name: 'Sathish R', identifier: '7376211EC204', type: 'STUDENT', department: 'ECE', contact: '9788114422', emergencyContact: '9788114429' }
      ],
      createdAt: new Date().toISOString()
    }
  ];
};
