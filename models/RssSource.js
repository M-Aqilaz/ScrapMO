/**
 * RSS Source Model
 * Handles database operations for RSS sources
 */
const pool = require('../config/database');

// Province data for validation and display
const provinces = [
    { id: 11, region: 'Aceh' },
    { id: 12, region: 'Sumatera Utara' },
    { id: 13, region: 'Sumatera Barat' },
    { id: 14, region: 'Riau' },
    { id: 15, region: 'Jambi' },
    { id: 16, region: 'Sumatera Selatan' },
    { id: 17, region: 'Bengkulu' },
    { id: 18, region: 'Lampung' },
    { id: 19, region: 'Kepulauan Bangka Belitung' },
    { id: 21, region: 'Kepulauan Riau' },
    { id: 31, region: 'Jakarta' },
    { id: 32, region: 'Jawa Barat' },
    { id: 33, region: 'Jawa Tengah' },
    { id: 34, region: 'DI Yogyakarta' },
    { id: 35, region: 'Jawa Timur' },
    { id: 36, region: 'Banten' },
    { id: 51, region: 'Bali' },
    { id: 52, region: 'Nusa Tenggara Barat' },
    { id: 53, region: 'Nusa Tenggara Timur' },
    { id: 61, region: 'Kalimantan Barat' },
    { id: 62, region: 'Kalimantan Tengah' },
    { id: 63, region: 'Kalimantan Selatan' },
    { id: 64, region: 'Kalimantan Timur' },
    { id: 65, region: 'Kalimantan Utara' },
    { id: 71, region: 'Sulawesi Utara' },
    { id: 72, region: 'Sulawesi Tengah' },
    { id: 73, region: 'Sulawesi Selatan' },
    { id: 74, region: 'Sulawesi Tenggara' },
    { id: 75, region: 'Gorontalo' },
    { id: 76, region: 'Sulawesi Barat' },
    { id: 81, region: 'Maluku' },
    { id: 82, region: 'Maluku Utara' },
    { id: 91, region: 'Papua Barat' },
    { id: 92, region: 'Papua' },
    { id: 93, region: 'Papua Selatan' },
    { id: 94, region: 'Papua Tengah' },
    { id: 95, region: 'Papua Pegunungan' },
    { id: 96, region: 'Papua Barat Daya' }
];

class RssSource {
    /**
     * Get all provinces
     */
    static getProvinces() {
        return provinces;
    }

    /**
     * Get region name by province_id
     */
    static getRegionByProvinceId(provinceId) {
        const province = provinces.find(p => p.id === provinceId);
        return province ? province.region : null;
    }

    /**
     * Get all RSS sources
     */
    static async findAll() {
        try {
            const result = await pool.query(
                'SELECT * FROM rss_source ORDER BY region ASC'
            );
            return result.rows;
        } catch (error) {
            console.error('Error fetching RSS sources:', error);
            throw error;
        }
    }

    /**
     * Get only active RSS sources
     */
    static async findActive() {
        try {
            const result = await pool.query(
                'SELECT * FROM rss_source WHERE is_active = TRUE ORDER BY region ASC'
            );
            return result.rows;
        } catch (error) {
            console.error('Error fetching active RSS sources:', error);
            throw error;
        }
    }

    /**
     * Get RSS source by ID
     */
    static async findById(id) {
        try {
            const result = await pool.query(
                'SELECT * FROM rss_source WHERE id = $1',
                [id]
            );
            return result.rows[0] || null;
        } catch (error) {
            console.error('Error fetching RSS source:', error);
            throw error;
        }
    }

    /**
     * Create new RSS source
     */
    static async create(url, region, description, isActive, provinceId) {
        try {
            const result = await pool.query(
                `INSERT INTO rss_source (url, region, description, is_active, province_id) 
                 VALUES ($1, $2, $3, $4, $5) 
                 RETURNING *`,
                [url, region, description || null, isActive || false, provinceId]
            );
            return result.rows[0];
        } catch (error) {
            console.error('Error creating RSS source:', error);
            throw error;
        }
    }

    /**
     * Update RSS source
     */
    static async update(id, url, region, description, isActive, provinceId) {
        try {
            const result = await pool.query(
                `UPDATE rss_source 
                 SET url = $1, region = $2, description = $3, is_active = $4, province_id = $5 
                 WHERE id = $6 
                 RETURNING *`,
                [url, region, description || null, isActive || false, provinceId, id]
            );
            return result.rows[0] || null;
        } catch (error) {
            console.error('Error updating RSS source:', error);
            throw error;
        }
    }

    /**
     * Toggle active status
     */
    static async toggleActive(id) {
        try {
            const result = await pool.query(
                `UPDATE rss_source 
                 SET is_active = NOT is_active 
                 WHERE id = $1 
                 RETURNING *`,
                [id]
            );
            return result.rows[0] || null;
        } catch (error) {
            console.error('Error toggling RSS source:', error);
            throw error;
        }
    }

    /**
     * Delete RSS source
     */
    static async delete(id) {
        try {
            const result = await pool.query(
                'DELETE FROM rss_source WHERE id = $1 RETURNING *',
                [id]
            );
            return result.rows[0] || null;
        } catch (error) {
            console.error('Error deleting RSS source:', error);
            throw error;
        }
    }

    /**
     * Count total RSS sources
     */
    static async count() {
        try {
            const result = await pool.query('SELECT COUNT(*) FROM rss_source');
            return parseInt(result.rows[0].count, 10);
        } catch (error) {
            console.error('Error counting RSS sources:', error);
            throw error;
        }
    }
}

module.exports = RssSource;
