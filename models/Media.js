/**
 * Media Model
 * ============
 * Model untuk operasi CRUD media online
 */

const pool = require('../config/database');

class Media {
    /**
     * Get all media
     */
    static async findAll() {
        try {
            const result = await pool.query(
                'SELECT * FROM media_online ORDER BY nama ASC'
            );
            return result.rows;
        } catch (error) {
            console.error('Error finding media:', error);
            throw error;
        }
    }

    /**
     * Get media by ID
     */
    static async findById(id) {
        try {
            const result = await pool.query(
                'SELECT * FROM media_online WHERE id = $1',
                [id]
            );
            return result.rows[0] || null;
        } catch (error) {
            console.error('Error finding media by ID:', error);
            throw error;
        }
    }

    /**
     * Create new media
     */
    static async create(nama, url) {
        try {
            const result = await pool.query(
                'INSERT INTO media_online (nama, url) VALUES ($1, $2) RETURNING *',
                [nama, url]
            );
            return result.rows[0];
        } catch (error) {
            console.error('Error creating media:', error);
            throw error;
        }
    }

    /**
     * Update media
     */
    static async update(id, nama, url) {
        try {
            const result = await pool.query(
                'UPDATE media_online SET nama = $1, url = $2 WHERE id = $3 RETURNING *',
                [nama, url, id]
            );
            return result.rows[0] || null;
        } catch (error) {
            console.error('Error updating media:', error);
            throw error;
        }
    }

    /**
     * Delete media
     */
    static async delete(id) {
        try {
            const result = await pool.query(
                'DELETE FROM media_online WHERE id = $1 RETURNING *',
                [id]
            );
            return result.rows[0] || null;
        } catch (error) {
            console.error('Error deleting media:', error);
            throw error;
        }
    }

    /**
     * Count all media
     */
    static async count() {
        try {
            const result = await pool.query('SELECT COUNT(*) FROM media_online');
            return parseInt(result.rows[0].count);
        } catch (error) {
            console.error('Error counting media:', error);
            throw error;
        }
    }
}

module.exports = Media;
