/**
 * Health Controller
 * ==================
 * Health check endpoint handler
 */

class HealthController {
    /**
     * GET /health
     */
    static getHealth(req, res) {
        res.json({
            status: 'ok',
            timestamp: new Date().toISOString()
        });
    }
}

module.exports = HealthController;
