/**
 * Mathematical Interval Conflict Detection Algorithm
 * 
 * Theoretical & Mathematical Formulation:
 * A time conflict between requested interval [T_req_start, T_req_end] and
 * an existing booking interval [T_exist_start, T_exist_end] exists if and only if:
 * 
 * (T_req_start < T_exist_end) AND (T_req_end > T_exist_start)
 */

/**
 * Checks if two time intervals overlap.
 * @param {Date|string} reqStart - Requested Departure Date & Time
 * @param {Date|string} reqEnd - Requested Return Date & Time
 * @param {Date|string} existStart - Existing Booking Departure Date & Time
 * @param {Date|string} existEnd - Existing Booking Return Date & Time
 * @returns {boolean} True if there is a conflict/overlap, false otherwise.
 */
function isTimeOverlapping(reqStart, reqEnd, existStart, existEnd) {
  const reqS = new Date(reqStart).getTime();
  const reqE = new Date(reqEnd).getTime();
  const existS = new Date(existStart).getTime();
  const existE = new Date(existEnd).getTime();

  if (isNaN(reqS) || isNaN(reqE) || isNaN(existS) || isNaN(existE)) {
    return false;
  }

  return (reqS < existE) && (reqE > existS);
}

/**
 * Filters existing active bookings to find any that conflict with requested time window.
 * Active statuses considered conflicting: APPROVED, ALLOCATED, IN_PROGRESS, PENDING (optional advisory)
 */
function findConflictingBookings(requestedStart, requestedEnd, bookings, options = {}) {
  const { ignoreBookingId = null, filterVehicleId = null, filterDriverId = null, includePending = false } = options;
  
  const activeStatuses = ['APPROVED', 'ALLOCATED', 'IN_PROGRESS'];
  if (includePending) activeStatuses.push('PENDING');

  return bookings.filter(b => {
    if (ignoreBookingId && (b._id === ignoreBookingId || b.id === ignoreBookingId)) {
      return false;
    }

    if (!activeStatuses.includes(b.status)) {
      return false;
    }

    if (filterVehicleId && b.assignedVehicleId !== filterVehicleId && b.assignedVehicle?._id !== filterVehicleId) {
      return false;
    }

    if (filterDriverId && b.assignedDriverId !== filterDriverId && b.assignedDriver?._id !== filterDriverId) {
      return false;
    }

    return isTimeOverlapping(requestedStart, requestedEnd, b.departureDateTime, b.returnDateTime);
  });
}

/**
 * Evaluates fleet inventory and returns availability status for every vehicle.
 */
function evaluateFleetAvailability(vehicles, bookings, requestedStart, requestedEnd, requiredCapacity = 0) {
  return vehicles.map(vehicle => {
    const vId = vehicle._id || vehicle.id;

    // Check if vehicle is in maintenance or inactive
    if (vehicle.status === 'MAINTENANCE' || vehicle.status === 'INACTIVE') {
      return {
        ...vehicle,
        isAvailable: false,
        conflictReason: `Vehicle is currently under ${vehicle.status.toLowerCase()}`,
        conflicts: []
      };
    }

    // Check capacity constraint
    if (requiredCapacity > 0 && vehicle.capacity < requiredCapacity) {
      return {
        ...vehicle,
        isAvailable: false,
        conflictReason: `Insufficient capacity (${vehicle.capacity} seats, needed ${requiredCapacity})`,
        conflicts: []
      };
    }

    // Check mathematical time conflicts
    const conflicts = findConflictingBookings(requestedStart, requestedEnd, bookings, { filterVehicleId: vId });

    if (conflicts.length > 0) {
      return {
        ...vehicle,
        isAvailable: false,
        conflictReason: `Conflict with active booking (${conflicts[0].bookingRef}: ${new Date(conflicts[0].departureDateTime).toLocaleTimeString()} - ${new Date(conflicts[0].returnDateTime).toLocaleTimeString()})`,
        conflicts
      };
    }

    return {
      ...vehicle,
      isAvailable: true,
      conflictReason: null,
      conflicts: []
    };
  });
}

/**
 * Evaluates driver roster and returns availability for requested time window.
 */
function evaluateDriverAvailability(drivers, bookings, requestedStart, requestedEnd) {
  return drivers.map(driver => {
    const dId = driver._id || driver.id;

    if (driver.status === 'LEAVE' || driver.status === 'INACTIVE') {
      return {
        ...driver,
        isAvailable: false,
        conflictReason: `Driver is on ${driver.status.toLowerCase()}`,
        conflicts: []
      };
    }

    const conflicts = findConflictingBookings(requestedStart, requestedEnd, bookings, { filterDriverId: dId });

    if (conflicts.length > 0) {
      return {
        ...driver,
        isAvailable: false,
        conflictReason: `Assigned to trip ${conflicts[0].bookingRef}`,
        conflicts
      };
    }

    return {
      ...driver,
      isAvailable: true,
      conflictReason: null,
      conflicts: []
    };
  });
}

module.exports = {
  isTimeOverlapping,
  findConflictingBookings,
  evaluateFleetAvailability,
  evaluateDriverAvailability
};
