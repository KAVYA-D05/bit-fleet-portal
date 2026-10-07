const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { connectDB } = require('./config/db');

// Load environment variables
dotenv.config();

const app = express();

// Middleware
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Request logger for API auditing
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl}`);
  next();
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'ONLINE',
    system: 'BIT Centralized Vehicle Fleet Booking Portal',
    institution: 'Bannari Amman Institute of Technology (Autonomous)',
    timestamp: new Date().toISOString()
  });
});

// Mount Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/bookings', require('./routes/bookingRoutes'));
app.use('/api/vehicles', require('./routes/vehicleRoutes'));
app.use('/api/drivers', require('./routes/driverRoutes'));
app.use('/api/trips', require('./routes/tripRoutes'));
app.use('/api/analytics', require('./routes/analyticsRoutes'));
app.use('/api/ai', require('./routes/aiRoutes'));

// 404 Route handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `API endpoint ${req.originalUrl} not found.`
  });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('Unhandled Server Error:', err);
  res.status(500).json({
    success: false,
    message: 'Internal server error',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

const PORT = process.env.PORT || 5000;

// Initialize Database & Start Server
const startServer = async () => {
  await connectDB();
  
  app.listen(PORT, () => {
    console.log(`\n======================================================`);
    console.log(`🚀 BIT FLEET BOOKING PORTAL REST API IS RUNNING`);
    console.log(`📍 URL: http://localhost:${PORT}`);
    console.log(`⚡ Health: http://localhost:${PORT}/api/health`);
    console.log(`🤖 AI Assistant: http://localhost:${PORT}/api/ai/chat`);
    console.log(`======================================================\n`);
  });
};

startServer();

module.exports = app;
