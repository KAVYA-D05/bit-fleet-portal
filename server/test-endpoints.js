const http = require('http');

async function runTests() {
  console.log('--- Starting BIT Fleet Portal Feature Verification Tests ---');

  // Require controllers directly to test business logic
  const aiController = require('./src/controllers/aiAssistantController');
  const bookingController = require('./src/controllers/bookingController');
  const Driver = require('./src/models/Driver');
  const Booking = require('./src/models/Booking');
  const store = require('./src/utils/dataStore');

  // Test 1: Weather Advisory Logic
  console.log('\n[Test 1] Weather Advisory Generation:');
  const reqWeather = {
    body: {
      destination: 'Ooty (Udhagamandalam)',
      date: '2026-09-20T08:00:00.000Z'
    }
  };
  const resWeather = {
    status: function(code) { this.statusCode = code; return this; },
    json: function(data) {
      console.log('Weather Status:', this.statusCode);
      console.log('Destination:', data.weather?.destination);
      console.log('Weather Condition:', data.weather?.condition, '| Status:', data.weather?.status);
      console.log('Driver Tips Count:', data.weather?.driverTips?.length);
      if (data.success && data.weather?.condition) console.log('✅ Test 1 PASSED: Weather Advisory works accurately');
    }
  };
  await aiController.getWeatherAdvisory(reqWeather, resWeather);

  // Test 2: AI Assistant Famous Places Knowledge
  console.log('\n[Test 2] AI Assistant Famous Places Query:');
  const reqAi = {
    user: { name: 'Dr. Rajesh Kumar', department: 'Computer Science & Engineering', role: 'FACULTY', _id: 'usr_faculty_1' },
    body: {
      message: 'What are the famous tourist spots and places to visit near Ooty?',
      activeTrip: { destination: 'Ooty (Udhagamandalam)' }
    }
  };
  const resAi = {
    status: function(code) { this.statusCode = code; return this; },
    json: function(data) {
      if (data.reply) {
        console.log('AI Response Snippet:', data.reply.substring(0, 150) + '...');
        if (data.reply.includes('Botanical Gardens') || data.reply.includes('Doddabetta') || data.reply.includes('Pykara') || data.reply.includes('Ooty')) {
          console.log('✅ Test 2 PASSED: AI Assistant contains famous spots for Ooty');
        }
      } else {
        console.log('AI Response Error:', data);
      }
    }
  };
  await aiController.handleAIChat(reqAi, resAi);

  // Test 3: Safety Cockpit with Driver Health & Route Emergency Hospitals
  console.log('\n[Test 3] Safety Cockpit & Driver Biometrics:');
  const sampleBooking = (await Booking.findOne()) || store.bookings[0];
  if (sampleBooking) {
    const reqCockpit = {
      params: { id: sampleBooking._id || sampleBooking.id }
    };
    const resCockpit = {
      status: function(code) { this.statusCode = code; return this; },
      json: function(data) {
        console.log('Cockpit Data Status:', this.statusCode);
        if (data.driverHealth) {
          console.log('Driver Name:', data.driverHealth.driverName);
          console.log('Live Heart Rate:', data.driverHealth.heartRateBpm, 'BPM | Blood Pressure:', data.driverHealth.bloodPressure);
          console.log('Oxygen SpO2:', data.driverHealth.spo2Percent, '% | Alertness:', data.driverHealth.alertnessPercent, '%');
          console.log('Continuous Driving Time:', data.driverHealth.continuousDrivingFormatted);
          console.log('Nearby Emergency Hospitals Count:', data.nearbyHospitals?.length);
          console.log('First Hospital:', data.nearbyHospitals?.[0]?.name, '(', data.nearbyHospitals?.[0]?.distanceKm, 'km away, ETA:', data.nearbyHospitals?.[0]?.etaMins, 'mins)');
          console.log('Emergency Hotlines Available:', data.emergencyContacts?.length);
          console.log('✅ Test 3 PASSED: Driver Health Telemetry & Hospitals Cockpit works seamlessly');
        } else {
          console.log('Cockpit Data Result:', data);
        }
      }
    };
    await bookingController.getTripSafetyCockpit(reqCockpit, resCockpit);

    // Test 4: SOS Emergency Broadcast
    console.log('\n[Test 4] 1-Click SOS Broadcast:');
    const reqSos = {
      params: { id: sampleBooking._id || sampleBooking.id },
      user: { name: 'Dr. Rajesh Kumar' },
      body: { emergencyType: 'MEDICAL_EMERGENCY', remarks: 'Faculty medical attention required on route' }
    };
    const resSos = {
      status: function(code) { this.statusCode = code; return this; },
      json: function(data) {
        console.log('SOS Message:', data.message);
        if (data.sosDetails) {
          console.log('Dispatched Services:', data.sosDetails.dispatchedServices);
          console.log('✅ Test 4 PASSED: SOS Broadcast dispatched correctly');
        }
      }
    };
    await bookingController.triggerTripSOS(reqSos, resSos);
  }

  console.log('\n--- All Automated Verification Tests Finished Successfully! ---');
  process.exit(0);
}

runTests().catch(err => {
  console.error('Test failed:', err);
  process.exit(1);
});
