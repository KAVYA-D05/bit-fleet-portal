const API_BASE = '/api';

// Direct REST API request helper with JWT Authorization
async function request(endpoint, options = {}) {
  const token = localStorage.getItem('bit_fleet_token');
  
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  const config = {
    ...options,
    headers,
  };

  if (config.body && typeof config.body === 'object') {
    config.body = JSON.stringify(config.body);
  }

  const response = await fetch(`${API_BASE}${endpoint}`, config);
  const data = await response.json();

  if (!response.ok) {
    const error = new Error(data.message || 'API request failed');
    error.status = response.status;
    error.data = data;
    throw error;
  }

  return data;
}

export const api = {
  // Institutional BIT Authentication
  login: (email, password) => request('/auth/login', { method: 'POST', body: { email, password } }),
  googleSSO: (email, name) => request('/auth/google-sso', { method: 'POST', body: { email, name } }),
  getMe: () => request('/auth/me'),

  // Bookings & Conflict Algorithm in MongoDB
  checkAvailability: (params) => request('/bookings/check-availability', { method: 'POST', body: params }),
  createBooking: (bookingData) => request('/bookings', { method: 'POST', body: bookingData }),
  getBookings: (filters = {}) => {
    const query = new URLSearchParams(filters).toString();
    return request(`/bookings${query ? `?${query}` : ''}`);
  },
  getBookingById: (id) => request(`/bookings/${id}`),
  getTripSafetyCockpit: (id) => request(`/bookings/${id}/safety-cockpit`),
  triggerTripSOS: (id, emergencyData = {}) => request(`/bookings/${id}/trigger-sos`, { method: 'POST', body: emergencyData }),
  handleApproval: (id, action, remarks) => request(`/bookings/${id}/approval`, { method: 'PUT', body: { action, remarks } }),
  cancelBooking: (id, reason) => request(`/bookings/${id}/cancel`, { method: 'PUT', body: { reason } }),
  submitTripRating: (id, ratingData) => request(`/bookings/${id}/rating`, { method: 'PUT', body: ratingData }),
  reviewTripFeedback: (id, actionTaken) => request(`/bookings/${id}/feedback-review`, { method: 'PUT', body: { actionTaken } }),
  assignVehicleAndDriver: (id, vehicleId, driverId, remarks) => request(`/bookings/${id}/assign`, { method: 'PUT', body: { vehicleId, driverId, remarks } }),
  updateBookingStatus: (id, status) => request(`/bookings/${id}/status`, { method: 'PUT', body: { status } }),

  // Fleet, Drivers & Real-Time GPS Tracking in MongoDB
  getVehicles: (filters = {}) => {
    const query = new URLSearchParams(filters).toString();
    return request(`/vehicles${query ? `?${query}` : ''}`);
  },
  getLiveLocations: () => request('/vehicles/live-locations'),
  updateGpsLocation: (id, locationData) => request(`/vehicles/${id}/location`, { method: 'PUT', body: locationData }),
  addVehicle: (vehicleData) => request('/vehicles', { method: 'POST', body: vehicleData }),
  updateVehicle: (id, data) => request(`/vehicles/${id}`, { method: 'PUT', body: data }),
  getDrivers: (filters = {}) => {
    const query = new URLSearchParams(filters).toString();
    return request(`/drivers${query ? `?${query}` : ''}`);
  },
  addDriver: (driverData) => request('/drivers', { method: 'POST', body: driverData }),
  getMyAssignedTrips: () => request('/drivers/my-trips'),

  // Trip Logs in MongoDB
  startTrip: (bookingId, startOdometer) => request('/trips/start', { method: 'POST', body: { bookingId, startOdometer } }),
  completeTrip: (tripData) => request('/trips/complete', { method: 'POST', body: tripData }),

  // Institutional Analytics directly from MongoDB
  getDashboardStats: () => request('/analytics/dashboard'),

  // 24/7 AI Transport Assistant (ETA, Weather & App Help)
  askAI: (message, conversationHistory = []) => request('/ai/chat', { method: 'POST', body: { message, conversationHistory } }),
  getWeatherAdvisory: (destination, date) => request('/ai/weather', { method: 'POST', body: { destination, date } }),
};
