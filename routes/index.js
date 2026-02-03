/**
 * Main Router
 * ============
 * Combines all routes
 */

const express = require('express');
const router = express.Router();
const path = require('path');

const HealthController = require('../controllers/HealthController');
const apiRoutes = require('./api');
const apiV1Routes = require('./apiV1');
const authRoutes = require('./auth');
const rssSourceRoutes = require('./rssSource');
const { requireAuth } = require('../middleware/authMiddleware');

// Health check (public)
router.get('/health', HealthController.getHealth);

// Auth routes (public)
router.use('/', authRoutes);

// Mount API routes (public - untuk n8n)
router.use('/api', apiRoutes);
router.use('/api/v1', apiV1Routes);

// RSS Source routes (protected)
router.use('/', rssSourceRoutes);

// Protected routes - halaman utama
router.get('/', requireAuth, (req, res) => {
    res.sendFile(path.join(__dirname, '../public/index.html'));
});

module.exports = router;

