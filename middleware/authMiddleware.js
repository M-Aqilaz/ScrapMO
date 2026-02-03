/**
 * Auth Middleware
 * ================
 * Middleware untuk proteksi route
 */

/**
 * Require authentication - redirect ke login jika belum login
 */
function requireAuth(req, res, next) {
    if (req.session && req.session.userId) {
        return next();
    }

    // Jika request adalah API (JSON), return 401
    if (req.xhr || req.headers.accept?.includes('application/json')) {
        return res.status(401).json({
            success: false,
            message: 'Unauthorized - silakan login terlebih dahulu'
        });
    }

    // Redirect ke halaman login
    return res.redirect('/login');
}

/**
 * Redirect jika sudah login (untuk halaman login)
 */
function redirectIfAuth(req, res, next) {
    if (req.session && req.session.userId) {
        return res.redirect('/');
    }
    return next();
}

module.exports = {
    requireAuth,
    redirectIfAuth
};
