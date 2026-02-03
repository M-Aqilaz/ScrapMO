/**
 * Media Routes
 * =============
 * Routes untuk CRUD media online
 */

const express = require('express');
const router = express.Router();

const MediaController = require('../controllers/MediaController');
const { requireAuth } = require('../middleware/authMiddleware');

// Page route (protected)
router.get('/media', requireAuth, MediaController.showMediaPage);

// API routes (protected)
router.get('/api/media', requireAuth, MediaController.getAll);
router.get('/api/media/:id', requireAuth, MediaController.getById);
router.post('/api/media', requireAuth, MediaController.create);
router.put('/api/media/:id', requireAuth, MediaController.update);
router.delete('/api/media/:id', requireAuth, MediaController.delete);

module.exports = router;
