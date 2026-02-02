/**
 * Article Model
 * ==============
 * Database operations for rss_result table
 */

const pool = require('../config/database');

class Article {
    /**
     * Get all articles with filters and pagination
     */
    static async findAll(limit = 50, offset = 0, search = '', fromId = 0) {
        let query = 'SELECT * FROM rss_result WHERE 1=1';
        let countQuery = 'SELECT COUNT(*) as total FROM rss_result WHERE 1=1';
        const params = [];
        let paramIndex = 1;

        if (search) {
            query += ` AND title ILIKE $${paramIndex}`;
            countQuery += ` AND title ILIKE $${paramIndex}`;
            params.push(`%${search}%`);
            paramIndex++;
        }

        if (fromId > 0) {
            query += ` AND id > $${paramIndex}`;
            countQuery += ` AND id > $${paramIndex}`;
            params.push(fromId);
            paramIndex++;
        }

        const countResult = await pool.query(countQuery, params);
        const totalCount = parseInt(countResult.rows[0].total);

        query += ` ORDER BY id DESC LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`;
        params.push(limit, offset);

        const result = await pool.query(query, params);

        return {
            data: result.rows,
            total: totalCount,
            limit,
            offset
        };
    }

    /**
     * Get article by ID
     */
    static async findById(id) {
        const result = await pool.query(
            'SELECT * FROM rss_result WHERE id = $1',
            [id]
        );
        return result.rows[0] || null;
    }

    /**
     * Get latest articles
     */
    static async findLatest(count = 10) {
        const result = await pool.query(
            'SELECT * FROM rss_result ORDER BY id DESC LIMIT $1',
            [count]
        );
        return result.rows;
    }

    /**
     * Get basic list (limit 100)
     */
    static async getBasicList() {
        const result = await pool.query(
            'SELECT * FROM rss_result ORDER BY id DESC LIMIT 100'
        );
        return result.rows;
    }

    /**
     * Create single article
     */
    static async create(article) {
        const result = await pool.query(
            `INSERT INTO rss_result (title, url, publish_date, content_snippet) 
             VALUES ($1, $2, $3, $4) RETURNING *`,
            [
                article.title,
                article.url,
                article.publish_date || 'N/A',
                article.content_snippet || ''
            ]
        );
        return result.rows[0];
    }

    /**
     * Create multiple articles (bulk insert)
     */
    static async createBulk(articles) {
        const client = await pool.connect();
        let insertedCount = 0;
        let skippedCount = 0;
        const insertedArticles = [];

        try {
            await client.query('BEGIN');

            for (const article of articles) {
                if (!article.title || !article.url) {
                    skippedCount++;
                    continue;
                }

                const exists = await this.checkUrlExists(article.url, client);
                if (!exists) {
                    const result = await client.query(
                        `INSERT INTO rss_result (title, url, publish_date, content_snippet) 
                         VALUES ($1, $2, $3, $4) RETURNING *`,
                        [
                            article.title,
                            article.url,
                            article.publish_date || 'N/A',
                            article.content_snippet || ''
                        ]
                    );
                    insertedArticles.push(result.rows[0]);
                    insertedCount++;
                } else {
                    skippedCount++;
                }
            }

            await client.query('COMMIT');

            return { insertedCount, skippedCount, insertedArticles };
        } catch (error) {
            await client.query('ROLLBACK');
            throw error;
        } finally {
            client.release();
        }
    }

    /**
     * Delete article by ID
     */
    static async deleteById(id) {
        const result = await pool.query(
            'DELETE FROM rss_result WHERE id = $1 RETURNING *',
            [id]
        );
        return result.rows[0] || null;
    }

    /**
     * Delete all articles
     */
    static async deleteAll() {
        const result = await pool.query('DELETE FROM rss_result');
        return result.rowCount;
    }

    /**
     * Get statistics
     */
    static async getStats() {
        const result = await pool.query('SELECT COUNT(*) as total FROM rss_result');
        return {
            total_articles: parseInt(result.rows[0].total)
        };
    }

    /**
     * Check if URL already exists
     */
    static async checkUrlExists(url, client = null) {
        const db = client || pool;
        const result = await db.query(
            'SELECT id FROM rss_result WHERE url = $1',
            [url]
        );
        return result.rows.length > 0 ? result.rows[0].id : null;
    }

    /**
     * Export all articles
     */
    static async exportAll() {
        const result = await pool.query(
            'SELECT * FROM rss_result ORDER BY id ASC'
        );
        return result.rows;
    }
}

module.exports = Article;
