/**
 * Application Entry Point
 * ========================
 * Main entry point for the Express application
 */

const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');

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
app.use(express.static('public'));

// Mount routes
app.use('/', routes);

// Start server
app.listen(config.PORT, () => {
    console.log(`Server running on http://localhost:${config.PORT}`);
    console.log(`📡 REST API available at /api/v1/`);
});

module.exports = app;
