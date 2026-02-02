/**
 * Scrape Controller
 * ==================
 * Handles scraping requests
 */

const ScraperService = require('../services/ScraperService');

class ScrapeController {
    /**
     * POST /api/scrape
     * Scrape news and save to database
     */
    static async scrape(req, res) {
        const { url, startDate, endDate } = req.body;

        if (!url || !startDate || !endDate) {
            return res.status(400).json({
                error: 'Missing required parameters (url, startDate, endDate)'
            });
        }

        try {
            const result = await ScraperService.scrapeAndSave(url, startDate, endDate);
            res.json(result);
        } catch (error) {
            console.error('Scraping error:', error);
            res.status(500).json({
                error: 'Failed to scrape: ' + error.message
            });
        }
    }
}

module.exports = ScrapeController;
