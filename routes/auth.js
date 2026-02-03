/**
 * Auth Routes
 * ============
 * Routes untuk autentikasi
 */

const express = require('express');
const router = express.Router();

const AuthController = require('../controllers/AuthController');
const { redirectIfAuth } = require('../middleware/authMiddleware');

// GET /login - Tampilkan halaman login
router.get('/login', redirectIfAuth, AuthController.showLoginPage);

// POST /login - Proses login
router.post('/login', AuthController.login);

// POST /logout - Proses logout
router.post('/logout', AuthController.logout);

// GET /auth/check - Check status autentikasi
router.get('/auth/check', AuthController.checkAuth);

module.exports = router;
