/**
 * RSS Source Routes
 */
const express = require('express');
const router = express.Router();
const RssSourceController = require('../controllers/RssSourceController');
const { requireAuth } = require('../middleware/authMiddleware');

// Protected page
router.get('/rss-source', requireAuth, RssSourceController.showPage);

// API endpoints (protected)
router.get('/api/rss-source', requireAuth, RssSourceController.getAll);
router.get('/api/rss-source/active', RssSourceController.getActive); // For main page dropdown
router.get('/api/rss-source/provinces', requireAuth, RssSourceController.getProvinces);
router.get('/api/rss-source/:id', requireAuth, RssSourceController.getById);
router.post('/api/rss-source', requireAuth, RssSourceController.create);
router.put('/api/rss-source/:id', requireAuth, RssSourceController.update);
router.patch('/api/rss-source/:id/toggle', requireAuth, RssSourceController.toggleActive);
router.delete('/api/rss-source/:id', requireAuth, RssSourceController.delete);

module.exports = router;
