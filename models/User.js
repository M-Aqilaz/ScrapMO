/**
 * User Model
 * ===========
 * Model untuk operasi database user
 */

const pool = require('../config/database');
const bcrypt = require('bcryptjs');

class User {
    /**
     * Cari user berdasarkan username
     * @param {string} username - Username yang dicari
     * @returns {Promise<Object|null>} - User object atau null
     */
    static async findByUsername(username) {
        try {
            const result = await pool.query(
                'SELECT * FROM users WHERE username = $1',
                [username]
            );
            return result.rows[0] || null;
        } catch (error) {
            console.error('Error finding user:', error);
            throw error;
        }
    }

    /**
     * Verifikasi password
     * @param {string} password - Password yang diinput
     * @param {string} hash - Hash password dari database
     * @returns {Promise<boolean>} - True jika valid
     */
    static async verifyPassword(password, hash) {
        try {
            return await bcrypt.compare(password, hash);
        } catch (error) {
            console.error('Error verifying password:', error);
            throw error;
        }
    }

    /**
     * Hash password baru
     * @param {string} password - Password plain text
     * @returns {Promise<string>} - Hashed password
     */
    static async hashPassword(password) {
        const salt = await bcrypt.genSalt(10);
        return await bcrypt.hash(password, salt);
    }

    /**
     * Buat user baru
     * @param {string} username - Username
     * @param {string} password - Password (plain text)
     * @returns {Promise<Object>} - Created user
     */
    static async create(username, password) {
        try {
            const hashedPassword = await this.hashPassword(password);
            const result = await pool.query(
                'INSERT INTO users (username, password) VALUES ($1, $2) RETURNING id, username, created_at',
                [username, hashedPassword]
            );
            return result.rows[0];
        } catch (error) {
            console.error('Error creating user:', error);
            throw error;
        }
    }
}

module.exports = User;
