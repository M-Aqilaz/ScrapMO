/**
 * API V1 Routes
 * ==============
 * REST API v1 routes (/api/v1)
 */

const express = require('express');
const router = express.Router();

const ApiV1Controller = require('../controllers/ApiV1Controller');

// GET /api/v1/articles - Get articles with filters
router.get('/articles', ApiV1Controller.getArticles);

// GET /api/v1/articles/:id - Get article by ID
router.get('/articles/:id', ApiV1Controller.getArticleById);

// GET /api/v1/latest - Get latest articles
router.get('/latest', ApiV1Controller.getLatest);

// POST /api/v1/articles - Create single article
router.post('/articles', ApiV1Controller.createArticle);

// POST /api/v1/articles/bulk - Create multiple articles
router.post('/articles/bulk', ApiV1Controller.createBulk);

// DELETE /api/v1/articles/:id - Delete article by ID
router.delete('/articles/:id', ApiV1Controller.deleteArticle);

// GET /api/v1/export - Export all data
router.get('/export', ApiV1Controller.exportAll);

module.exports = router;
