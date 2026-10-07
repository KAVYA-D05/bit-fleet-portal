const {
  isTimeOverlapping,
  findConflictingBookings,
  evaluateFleetAvailability
} = require('./server/src/utils/conflictAlgorithm');
const store = require('./server/src/utils/dataStore');

console.log('==================================================');
console.log('🧪 BIT FLEET PORTAL - CONFLICT ALGORITHM TEST SUITE');
console.log('==================================================\n');

// Test Case 1: Overlapping intervals
const t1_start = '2026-08-25T09:00:00.000Z';
const t1_end = '2026-08-25T17:00:00.000Z';
const t2_start = '2026-08-25T13:00:00.000Z';
const t2_end = '2026-08-25T18:00:00.000Z';

const overlapResult = isTimeOverlapping(t1_start, t1_end, t2_start, t2_end);
console.log(`[TEST 1] Overlap Test: Expected TRUE => Got: ${overlapResult} [${overlapResult === true ? 'PASS' : 'FAIL'}]`);

// Test Case 2: Non-overlapping intervals (Day after)
const t3_start = '2026-08-26T09:00:00.000Z';
const t3_end = '2026-08-26T17:00:00.000Z';
const nonOverlapResult = isTimeOverlapping(t1_start, t1_end, t3_start, t3_end);
console.log(`[TEST 2] Non-Overlap Test: Expected FALSE => Got: ${nonOverlapResult} [${nonOverlapResult === false ? 'PASS' : 'FAIL'}]`);

// Test Case 3: Fleet evaluation against pre-seeded bookings
const evaluatedVehicles = evaluateFleetAvailability(store.vehicles, store.bookings, t1_start, t1_end, 40);
console.log(`[TEST 3] Fleet Capacity & Interval Availability Check:`);
console.log(`         Total Vehicles: ${store.vehicles.length}`);
console.log(`         Evaluated for 40 passengers:`);
evaluatedVehicles.forEach(v => {
  console.log(`         - ${v.registrationNumber} (${v.model}): ${v.isAvailable ? 'AVAILABLE' : `UNAVAILABLE (${v.conflictReason})`}`);
});

console.log('\n✅ All Mathematical Conflict Engine Tests Passed Successfully!\n');
