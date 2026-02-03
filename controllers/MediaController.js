/**
 * Media Controller
 * =================
 * Controller untuk CRUD media online
 */

const Media = require('../models/Media');
const path = require('path');

class MediaController {
    /**
     * Tampilkan halaman media
     */
    static showMediaPage(req, res) {
        res.sendFile(path.join(__dirname, '../public/media.html'));
    }

    /**
     * Get all media (API)
     */
    static async getAll(req, res) {
        try {
            const media = await Media.findAll();
            return res.json({
                success: true,
                data: media,
                total: media.length
            });
        } catch (error) {
            console.error('Get all media error:', error);
            return res.status(500).json({
                success: false,
                message: 'Gagal mengambil data media'
            });
        }
    }

    /**
     * Get media by ID (API)
     */
    static async getById(req, res) {
        try {
            const { id } = req.params;
            const media = await Media.findById(id);

            if (!media) {
                return res.status(404).json({
                    success: false,
                    message: 'Media tidak ditemukan'
                });
            }

            return res.json({
                success: true,
                data: media
            });
        } catch (error) {
            console.error('Get media by ID error:', error);
            return res.status(500).json({
                success: false,
                message: 'Gagal mengambil data media'
            });
        }
    }

    /**
     * Create media (API)
     */
    static async create(req, res) {
        try {
            const { nama, url } = req.body;

            // Validation
            if (!nama || !url) {
                return res.status(400).json({
                    success: false,
                    message: 'Nama dan URL diperlukan'
                });
            }

            const media = await Media.create(nama, url);
            return res.status(201).json({
                success: true,
                message: 'Media berhasil ditambahkan',
                data: media
            });
        } catch (error) {
            console.error('Create media error:', error);
            return res.status(500).json({
                success: false,
                message: 'Gagal menambahkan media'
            });
        }
    }

    /**
     * Update media (API)
     */
    static async update(req, res) {
        try {
            const { id } = req.params;
            const { nama, url } = req.body;

            // Validation
            if (!nama || !url) {
                return res.status(400).json({
                    success: false,
                    message: 'Nama dan URL diperlukan'
                });
            }

            const media = await Media.update(id, nama, url);

            if (!media) {
                return res.status(404).json({
                    success: false,
                    message: 'Media tidak ditemukan'
                });
            }

            return res.json({
                success: true,
                message: 'Media berhasil diupdate',
                data: media
            });
        } catch (error) {
            console.error('Update media error:', error);
            return res.status(500).json({
                success: false,
                message: 'Gagal mengupdate media'
            });
        }
    }

    /**
     * Delete media (API)
     */
    static async delete(req, res) {
        try {
            const { id } = req.params;
            const media = await Media.delete(id);

            if (!media) {
                return res.status(404).json({
                    success: false,
                    message: 'Media tidak ditemukan'
                });
            }

            return res.json({
                success: true,
                message: 'Media berhasil dihapus',
                data: media
            });
        } catch (error) {
            console.error('Delete media error:', error);
            return res.status(500).json({
                success: false,
                message: 'Gagal menghapus media'
            });
        }
    }
}

module.exports = MediaController;
