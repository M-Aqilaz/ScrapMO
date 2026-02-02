/**
 * Main Router
 * ============
 * Combines all routes
 */

const express = require('express');
const router = express.Router();

const HealthController = require('../controllers/HealthController');
const apiRoutes = require('./api');
const apiV1Routes = require('./apiV1');

// Health check
router.get('/health', HealthController.getHealth);

// Mount API routes
router.use('/api', apiRoutes);
router.use('/api/v1', apiV1Routes);

module.exports = router;
