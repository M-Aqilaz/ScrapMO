/**
 * Application Entry Point
 * ========================
 * Main entry point for the Express application
 */

const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
const session = require('express-session');

// Load configuration
const config = require('./config');

// Initialize database connection (loads pool and tests connection)
require('./config/database');

// Import routes
const routes = require('./routes');

// Create Express app
const app = express();

// Apply middleware
app.use(cors(config.corsOptions));
app.use(bodyParser.json());
app.use(session(config.session));

// Mount routes BEFORE static files (so auth middleware runs first)
app.use('/', routes);

// Static files for assets (CSS, JS, images) - but not index.html
app.use(express.static('public', { index: false }));

// Start server
app.listen(config.PORT, () => {
    console.log(`Server running on http://localhost:${config.PORT}`);
    console.log(`📡 REST API available at /api/v1/`);
});

module.exports = app;
