/**
 * Date Parser Service
 * ====================
 * Utilities for parsing various date formats including Indonesian dates
 */

const moment = require('moment');

class DateParserService {
    /**
     * Parse enhanced date with relative date support
     * Supports: Indonesian dates, relative dates (kemarin, hari ini, X jam lalu)
     */
    static parseEnhancedDate(dateStr) {
        if (!dateStr) return null;

        const now = moment();

        // Relative date patterns
        const relativePatterns = [
            { pattern: /(\d+)\s*(jam|hour|hours)\s*(ago|lalu)/i, unit: 'hours' },
            { pattern: /(\d+)\s*(menit|minute|minutes|min)\s*(ago|lalu)/i, unit: 'minutes' },
            { pattern: /(\d+)\s*(hari|day|days)\s*(ago|lalu)/i, unit: 'days' },
            { pattern: /kemarin|yesterday/i, type: 'yesterday' },
            { pattern: /hari\s*ini|today/i, type: 'today' }
        ];

        for (const rel of relativePatterns) {
            const match = dateStr.match(rel.pattern);
            if (match) {
                if (rel.type === 'yesterday') {
                    return now.clone().subtract(1, 'days');
                } else if (rel.type === 'today') {
                    return now.clone();
                } else {
                    const amount = parseInt(match[1]);
                    return now.clone().subtract(amount, rel.unit);
                }
            }
        }

        // Clean and normalize Indonesian month names
        const cleanStr = dateStr.toLowerCase()
            .replace(/senin|selasa|rabu|kamis|jumat|sabtu|minggu/g, '')
            .replace(/januari/g, 'january')
            .replace(/februari/g, 'february')
            .replace(/maret/g, 'march')
            .replace(/april/g, 'april')
            .replace(/mei/g, 'may')
            .replace(/juni/g, 'june')
            .replace(/juli/g, 'july')
            .replace(/agustus/g, 'august')
            .replace(/september/g, 'september')
            .replace(/oktober/g, 'october')
            .replace(/november/g, 'november')
            .replace(/desember/g, 'december')
            .replace(/wib|wita|wit/g, '')
            .trim();

        // Common date formats
        const formats = [
            'DD MMMM YYYY', 'D MMMM YYYY', 'D MMM YYYY', 'MMM D, YYYY',
            'YYYY-MM-DD', 'DD/MM/YYYY', 'MM/DD/YYYY', 'DD-MM-YYYY',
            'YYYY-MM-DDTHH:mm:ss', 'YYYY-MM-DD HH:mm:ss'
        ];

        let parsed = moment(cleanStr, formats, false);
        if (!parsed.isValid()) {
            parsed = moment(new Date(cleanStr));
        }

        return parsed.isValid() ? parsed : null;
    }

    /**
     * Format date for display
     */
    static formatForDisplay(momentDate) {
        if (!momentDate || !momentDate.isValid()) return 'N/A';
        return momentDate.format('DD-MM-YYYY HH:mm');
    }

    /**
     * Check if date is within range
     */
    static isInRange(date, start, end) {
        if (!date || !date.isValid()) return false;
        return date.isBetween(start, end, 'day', '[]');
    }
}

module.exports = DateParserService;
