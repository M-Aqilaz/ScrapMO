/**
 * API Routes
 * ===========
 * Basic API routes (/api)
 */

const express = require('express');
const router = express.Router();

const ScrapeController = require('../controllers/ScrapeController');
const ArticleController = require('../controllers/ArticleController');

// POST /api/scrape - Scrape and save to database
router.post('/scrape', ScrapeController.scrape);

// GET /api/articles - Get all articles
router.get('/articles', ArticleController.getAll);

// DELETE /api/articles - Delete all articles
router.delete('/articles', ArticleController.deleteAll);

// GET /api/stats - Get statistics
router.get('/stats', ArticleController.getStats);

module.exports = router;
