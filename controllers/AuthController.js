/**
 * Auth Controller
 * ================
 * Controller untuk autentikasi (login/logout)
 */

const User = require('../models/User');
const path = require('path');

class AuthController {
    /**
     * Tampilkan halaman login
     */
    static showLoginPage(req, res) {
        res.sendFile(path.join(__dirname, '../public/login.html'));
    }

    /**
     * Proses login
     */
    static async login(req, res) {
        try {
            const { username, password } = req.body;

            // Validasi input
            if (!username || !password) {
                return res.status(400).json({
                    success: false,
                    message: 'Username dan password diperlukan'
                });
            }

            // Cari user
            const user = await User.findByUsername(username);
            if (!user) {
                return res.status(401).json({
                    success: false,
                    message: 'Username atau password salah'
                });
            }

            // Verifikasi password
            const isValid = await User.verifyPassword(password, user.password);
            if (!isValid) {
                return res.status(401).json({
                    success: false,
                    message: 'Username atau password salah'
                });
            }

            // Set session
            req.session.userId = user.id;
            req.session.username = user.username;

            return res.json({
                success: true,
                message: 'Login berhasil',
                user: {
                    id: user.id,
                    username: user.username
                }
            });
        } catch (error) {
            console.error('Login error:', error);
            return res.status(500).json({
                success: false,
                message: 'Terjadi kesalahan server'
            });
        }
    }

    /**
     * Proses logout
     */
    static logout(req, res) {
        req.session.destroy((err) => {
            if (err) {
                console.error('Logout error:', err);
                return res.status(500).json({
                    success: false,
                    message: 'Gagal logout'
                });
            }
            res.clearCookie('connect.sid');
            return res.json({
                success: true,
                message: 'Logout berhasil'
            });
        });
    }

    /**
     * Check status autentikasi
     */
    static checkAuth(req, res) {
        if (req.session && req.session.userId) {
            return res.json({
                authenticated: true,
                user: {
                    id: req.session.userId,
                    username: req.session.username
                }
            });
        }
        return res.json({
            authenticated: false
        });
    }
}

module.exports = AuthController;
