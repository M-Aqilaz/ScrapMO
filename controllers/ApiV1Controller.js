/**
 * API V1 Controller
 * ==================
 * REST API v1 handlers for n8n & automation tools
 */

const Article = require('../models/Article');

class ApiV1Controller {
    /**
     * GET /api/v1/articles
     * Get articles with filters, pagination, and search
     */
    static async getArticles(req, res) {
        try {
            const limit = Math.min(parseInt(req.query.limit) || 50, 500);
            const offset = parseInt(req.query.offset) || 0;
            const search = req.query.search || '';
            const fromId = parseInt(req.query.from_id) || 0;
            const format = req.query.format || 'full';

            const result = await Article.findAll(limit, offset, search, fromId);

            // Format response based on 'format' parameter
            let responseData;
            if (format === 'simple') {
                responseData = result.data.map(row => ({
                    id: row.id,
                    title: row.title,
                    url: row.url,
                    publish_date: row.publish_date
                }));
            } else {
                responseData = result.data;
            }

            res.json({
                success: true,
                meta: {
                    total: result.total,
                    limit: result.limit,
                    offset: result.offset,
                    returned: result.data.length,
                    has_more: result.offset + result.data.length < result.total
                },
                data: responseData
            });
        } catch (error) {
            console.error('API Error:', error);
            res.status(500).json({
                success: false,
                error: error.message
            });
        }
    }

    /**
     * GET /api/v1/articles/:id
     * Get article by ID
     */
    static async getArticleById(req, res) {
        try {
            const id = parseInt(req.params.id);

            if (isNaN(id)) {
                return res.status(400).json({
                    success: false,
                    error: 'Invalid ID'
                });
            }

            const article = await Article.findById(id);

            if (!article) {
                return res.status(404).json({
                    success: false,
                    error: 'Article not found'
                });
            }

            res.json({
                success: true,
                data: article
            });
        } catch (error) {
            console.error('API Error:', error);
            res.status(500).json({
                success: false,
                error: error.message
            });
        }
    }

    /**
     * GET /api/v1/latest
     * Get latest articles (for n8n polling trigger)
     */
    static async getLatest(req, res) {
        try {
            const count = Math.min(parseInt(req.query.count) || 10, 100);
            const articles = await Article.findLatest(count);

            res.json({
                success: true,
                count: articles.length,
                last_id: articles.length > 0 ? articles[0].id : null,
                data: articles
            });
        } catch (error) {
            console.error('API Error:', error);
            res.status(500).json({
                success: false,
                error: error.message
            });
        }
    }

    /**
     * POST /api/v1/articles
     * Create single article
     */
    static async createArticle(req, res) {
        try {
            const { title, url, publish_date, content_snippet } = req.body;

            if (!title || !url) {
                return res.status(400).json({
                    success: false,
                    error: 'title and url are required'
                });
            }

            // Check duplicate URL
            const existingId = await Article.checkUrlExists(url);
            if (existingId) {
                return res.status(409).json({
                    success: false,
                    error: 'Article with this URL already exists',
                    existing_id: existingId
                });
            }

            const article = await Article.create({
                title,
                url,
                publish_date,
                content_snippet
            });

            res.status(201).json({
                success: true,
                message: 'Article created',
                data: article
            });
        } catch (error) {
            console.error('API Error:', error);
            res.status(500).json({
                success: false,
                error: error.message
            });
        }
    }

    /**
     * POST /api/v1/articles/bulk
     * Create multiple articles
     */
    static async createBulk(req, res) {
        try {
            const { articles } = req.body;

            if (!Array.isArray(articles) || articles.length === 0) {
                return res.status(400).json({
                    success: false,
                    error: 'articles array is required'
                });
            }

            if (articles.length > 100) {
                return res.status(400).json({
                    success: false,
                    error: 'Maximum 100 articles per request'
                });
            }

            const result = await Article.createBulk(articles);

            res.status(201).json({
                success: true,
                message: `${result.insertedCount} articles created, ${result.skippedCount} skipped (duplicates or invalid)`,
                inserted: result.insertedCount,
                skipped: result.skippedCount,
                data: result.insertedArticles
            });
        } catch (error) {
            console.error('API Error:', error);
            res.status(500).json({
                success: false,
                error: error.message
            });
        }
    }

    /**
     * DELETE /api/v1/articles/:id
     * Delete article by ID
     */
    static async deleteArticle(req, res) {
        try {
            const id = parseInt(req.params.id);

            if (isNaN(id)) {
                return res.status(400).json({
                    success: false,
                    error: 'Invalid ID'
                });
            }

            const deleted = await Article.deleteById(id);

            if (!deleted) {
                return res.status(404).json({
                    success: false,
                    error: 'Article not found'
                });
            }

            res.json({
                success: true,
                message: 'Article deleted',
                deleted: deleted
            });
        } catch (error) {
            console.error('API Error:', error);
            res.status(500).json({
                success: false,
                error: error.message
            });
        }
    }

    /**
     * GET /api/v1/export
     * Export all data as JSON
     */
    static async exportAll(req, res) {
        try {
            const articles = await Article.exportAll();

            res.json({
                success: true,
                exported_at: new Date().toISOString(),
                total: articles.length,
                data: articles
            });
        } catch (error) {
            console.error('API Error:', error);
            res.status(500).json({
                success: false,
                error: error.message
            });
        }
    }
}

module.exports = ApiV1Controller;
