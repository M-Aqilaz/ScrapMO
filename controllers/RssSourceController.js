/**
 * RSS Source Controller
 * Handles HTTP requests for RSS source management
 */
const path = require('path');
const RssSource = require('../models/RssSource');

class RssSourceController {
    /**
     * Show RSS source management page
     */
    static showPage(req, res) {
        res.sendFile(path.join(__dirname, '../public/rss-source.html'));
    }

    /**
     * Get all provinces for dropdown
     */
    static getProvinces(req, res) {
        try {
            const provinces = RssSource.getProvinces();
            res.json({
                success: true,
                data: provinces
            });
        } catch (error) {
            console.error('Get provinces error:', error);
            res.status(500).json({
                success: false,
                message: 'Failed to fetch provinces'
            });
        }
    }

    /**
     * Get all RSS sources
     */
    static async getAll(req, res) {
        try {
            const sources = await RssSource.findAll();
            const total = await RssSource.count();

            res.json({
                success: true,
                data: sources,
                total: total
            });
        } catch (error) {
            console.error('Get all RSS sources error:', error);
            res.status(500).json({
                success: false,
                message: 'Failed to fetch RSS sources'
            });
        }
    }

    /**
     * Get only active RSS sources (for dropdown in main page)
     */
    static async getActive(req, res) {
        try {
            const sources = await RssSource.findActive();

            res.json({
                success: true,
                data: sources
            });
        } catch (error) {
            console.error('Get active RSS sources error:', error);
            res.status(500).json({
                success: false,
                message: 'Failed to fetch active RSS sources'
            });
        }
    }

    /**
     * Get RSS source by ID
     */
    static async getById(req, res) {
        try {
            const { id } = req.params;
            const source = await RssSource.findById(id);

            if (!source) {
                return res.status(404).json({
                    success: false,
                    message: 'RSS source not found'
                });
            }

            res.json({
                success: true,
                data: source
            });
        } catch (error) {
            console.error('Get RSS source error:', error);
            res.status(500).json({
                success: false,
                message: 'Failed to fetch RSS source'
            });
        }
    }

    /**
     * Create new RSS source
     */
    static async create(req, res) {
        try {
            const { url, province_id, description, is_active } = req.body;

            if (!url || !province_id) {
                return res.status(400).json({
                    success: false,
                    message: 'URL and Province are required'
                });
            }

            // Get region name from province_id
            const region = RssSource.getRegionByProvinceId(parseInt(province_id));
            if (!region) {
                return res.status(400).json({
                    success: false,
                    message: 'Invalid province ID'
                });
            }

            const source = await RssSource.create(
                url,
                region,
                description,
                is_active || false,
                parseInt(province_id)
            );

            res.status(201).json({
                success: true,
                message: 'RSS source created successfully',
                data: source
            });
        } catch (error) {
            console.error('Create RSS source error:', error);
            res.status(500).json({
                success: false,
                message: 'Failed to create RSS source'
            });
        }
    }

    /**
     * Update RSS source
     */
    static async update(req, res) {
        try {
            const { id } = req.params;
            const { url, province_id, description, is_active } = req.body;

            if (!url || !province_id) {
                return res.status(400).json({
                    success: false,
                    message: 'URL and Province are required'
                });
            }

            // Get region name from province_id
            const region = RssSource.getRegionByProvinceId(parseInt(province_id));
            if (!region) {
                return res.status(400).json({
                    success: false,
                    message: 'Invalid province ID'
                });
            }

            const source = await RssSource.update(
                id,
                url,
                region,
                description,
                is_active || false,
                parseInt(province_id)
            );

            if (!source) {
                return res.status(404).json({
                    success: false,
                    message: 'RSS source not found'
                });
            }

            res.json({
                success: true,
                message: 'RSS source updated successfully',
                data: source
            });
        } catch (error) {
            console.error('Update RSS source error:', error);
            res.status(500).json({
                success: false,
                message: 'Failed to update RSS source'
            });
        }
    }

    /**
     * Toggle active status
     */
    static async toggleActive(req, res) {
        try {
            const { id } = req.params;
            const source = await RssSource.toggleActive(id);

            if (!source) {
                return res.status(404).json({
                    success: false,
                    message: 'RSS source not found'
                });
            }

            res.json({
                success: true,
                message: `RSS source ${source.is_active ? 'activated' : 'deactivated'}`,
                data: source
            });
        } catch (error) {
            console.error('Toggle RSS source error:', error);
            res.status(500).json({
                success: false,
                message: 'Failed to toggle RSS source'
            });
        }
    }

    /**
     * Delete RSS source
     */
    static async delete(req, res) {
        try {
            const { id } = req.params;
            const source = await RssSource.delete(id);

            if (!source) {
                return res.status(404).json({
                    success: false,
                    message: 'RSS source not found'
                });
            }

            res.json({
                success: true,
                message: 'RSS source deleted successfully'
            });
        } catch (error) {
            console.error('Delete RSS source error:', error);
            res.status(500).json({
                success: false,
                message: 'Failed to delete RSS source'
            });
        }
    }
}

module.exports = RssSourceController;
