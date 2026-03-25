/**
 * AI School Platform - Express Server
 * Main entry point for the backend API
 */

const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 3001;

// ============================================================================
// MIDDLEWARE SETUP
// ============================================================================

// CORS Configuration
const corsOptions = {
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};

app.use(cors(corsOptions));

// Body parsing middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ============================================================================
// REQUEST LOGGING MIDDLEWARE
// ============================================================================

app.use((req, res, next) => {
  const start = Date.now();

  res.on('finish', () => {
    const duration = Date.now() - start;
    console.log(
      `[${new Date().toISOString()}] ${req.method} ${req.path} - ${res.statusCode} (${duration}ms)`
    );
  });

  next();
});

// ============================================================================
// ROUTES
// ============================================================================

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// API routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/industries', require('./routes/industries'));
app.use('/api/onboarding', require('./routes/onboarding'));
app.use('/api/lessons', require('./routes/lessons'));
app.use('/api/skills', require('./routes/skills'));
app.use('/api/matching', require('./routes/matching'));
app.use('/api/community', require('./routes/community'));
app.use('/api/dashboard', require('./routes/dashboard'));

// ============================================================================
// 404 HANDLER
// ============================================================================

app.use((req, res) => {
  res.status(404).json({
    error: 'Not Found',
    message: `The endpoint ${req.method} ${req.path} does not exist`,
    timestamp: new Date().toISOString(),
  });
});

// ============================================================================
// ERROR HANDLING MIDDLEWARE
// ============================================================================

/**
 * Global error handler
 * Should be defined last, after all other middleware and routes
 */
app.use((err, req, res, next) => {
  console.error('Error:', err);

  // Default error response
  const status = err.status || err.statusCode || 500;
  const message = err.message || 'Internal Server Error';

  res.status(status).json({
    error: status >= 500 ? 'Internal Server Error' : message,
    message: process.env.NODE_ENV === 'development' ? message : undefined,
    timestamp: new Date().toISOString(),
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
});

// ============================================================================
// START SERVER
// ============================================================================

const server = app.listen(PORT, () => {
  console.log(`\n🚀 AI School Platform Backend Server`);
  console.log(`📡 Running on http://localhost:${PORT}`);
  console.log(`🔗 CORS enabled for: ${process.env.FRONTEND_URL || 'http://localhost:3000'}`);
  console.log(`📝 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log('─'.repeat(50));
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('\n📤 SIGTERM signal received: closing HTTP server');
  server.close(() => {
    console.log('✅ HTTP server closed');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  console.log('\n📤 SIGINT signal received: closing HTTP server');
  server.close(() => {
    console.log('✅ HTTP server closed');
    process.exit(0);
  });
});

module.exports = app;
