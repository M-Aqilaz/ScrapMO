/**
 * Article Controller
 * ===================
 * Basic article CRUD handlers
 */

const Article = require('../models/Article');

class ArticleController {
    /**
     * GET /api/articles
     * Get all articles (basic list)
     */
    static async getAll(req, res) {
        try {
            const articles = await Article.getBasicList();
            res.json({
                success: true,
                count: articles.length,
                data: articles
            });
        } catch (error) {
            console.error('Database error:', error);
            res.status(500).json({
                error: 'Gagal mengambil data: ' + error.message
            });
        }
    }

    /**
     * DELETE /api/articles
     * Delete all articles
     */
    static async deleteAll(req, res) {
        try {
            const deletedCount = await Article.deleteAll();
            res.json({
                success: true,
                message: `${deletedCount} artikel berhasil dihapus.`
            });
        } catch (error) {
            console.error('Database error:', error);
            res.status(500).json({
                error: 'Gagal menghapus data: ' + error.message
            });
        }
    }

    /**
     * GET /api/stats
     * Get database statistics
     */
    static async getStats(req, res) {
        try {
            const stats = await Article.getStats();
            res.json({
                success: true,
                ...stats
            });
        } catch (error) {
            console.error('Database error:', error);
            res.status(500).json({
                error: 'Gagal mengambil statistik: ' + error.message
            });
        }
    }
}

module.exports = ArticleController;
