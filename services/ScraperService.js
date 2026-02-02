/**
 * Scraper Service
 * ================
 * Web scraping logic using Puppeteer
 */

const puppeteer = require('puppeteer');
const moment = require('moment');
const DateParserService = require('./DateParserService');
const Article = require('../models/Article');

class ScraperService {
    /**
     * Main scraping method
     */
    static async scrapeAndSave(url, startDate, endDate) {
        const start = moment(startDate).startOf('day');
        const end = moment(endDate).endOf('day');

        console.log(`Scraping: ${url} from ${start.format('YYYY-MM-DD')} to ${end.format('YYYY-MM-DD')}`);

        let browser;
        try {
            browser = await puppeteer.launch({
                headless: "new",
                args: [
                    '--no-sandbox',
                    '--disable-setuid-sandbox',
                    '--disable-blink-features=AutomationControlled'
                ]
            });
            const page = await browser.newPage();

            await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');

            // Block unnecessary resources
            await page.setRequestInterception(true);
            page.on('request', (req) => {
                if (['image', 'stylesheet', 'font', 'media'].includes(req.resourceType())) {
                    req.abort();
                } else {
                    req.continue();
                }
            });

            await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 120000 });

            // Debug screenshot
            try {
                await page.screenshot({ path: 'debug_screenshot.png' });
                console.log('[DEBUG] Screenshot saved to debug_screenshot.png');
            } catch (e) {
                console.log('[DEBUG] Failed to take screenshot: ' + e.message);
            }

            // Brute force scraping
            const scrapingResult = await this.extractLinksFromPage(page);

            console.log(`[DEBUG] Brute Force Log:`, scrapingResult.debug);
            console.log(`[DEBUG] Raw items found: ${scrapingResult.articles.length}`);

            // Filter candidates
            const candidates = this.filterCandidates(scrapingResult.articles);
            console.log(`[DEBUG] Candidates after title filtering: ${candidates.length}`);

            // Process each article to get metadata
            const finalResults = await this.processArticles(page, candidates, start, end);
            console.log(`[DEBUG] Articles after date filtering: ${finalResults.length}`);

            if (finalResults.length === 0) {
                console.log(`[WARN] ===== NO RESULTS FOUND =====`);
                return {
                    success: true,
                    message: 'Scraping selesai, tetapi tidak ada artikel yang ditemukan dalam rentang tanggal tersebut.',
                    count: 0,
                    skipped: 0,
                    total_found: 0
                };
            }

            // Save to database
            const saveResult = await this.saveToDatabase(finalResults);

            return {
                success: true,
                message: `Scraping selesai! ${saveResult.insertedCount} artikel baru disimpan ke database.`,
                count: saveResult.insertedCount,
                skipped: saveResult.skippedCount,
                total_found: finalResults.length
            };

        } finally {
            if (browser) await browser.close();
        }
    }

    /**
     * Extract links from page using brute force strategy
     */
    static async extractLinksFromPage(page) {
        return await page.evaluate(() => {
            const results = [];
            const debugLog = [];

            const mainSelectors = [
                '#main', '#content', '.main-content', '.post-listing',
                '.td-main-content', '.l-content', '.jeg_main_content',
                'main', '#primary'
            ];

            let container = document;
            for (const sel of mainSelectors) {
                const el = document.querySelector(sel);
                if (el) {
                    container = el;
                    debugLog.push(`Scoped scraping to: ${sel}`);
                    break;
                }
            }
            if (container === document) debugLog.push(`No main container found, scraping BODY.`);

            const allLinks = container.querySelectorAll('a[href]');
            debugLog.push(`Found ${allLinks.length} raw links in scope.`);

            const titleBlacklist = ['template', 'blogger', 'theme', 'wordpress', 'jasa', 'iklan', 'promo', 'login', 'signup', 'policy'];
            const regionPrefixes = ['kabupaten', 'kota', 'provinsi', 'kategori', 'tag', 'indeks', 'topik'];

            const currentYearStr = '/2026/';
            const oldYears = ['/2020/', '/2021/', '/2022/', '/2023/', '/2024/', '/2025/'];

            for (const link of allLinks) {
                const rawText = link.innerText.trim();
                const lines = rawText.split(/\r?\n/).map(l => l.trim()).filter(l => l.length > 0);

                const cleanLines = lines.filter(line => {
                    const isTimeStr = /^(\d+)\s*(menit|jam|hari|minute|hour|day|minutes|hours|days)\s*(lalu|ago)/i.test(line);
                    if (isTimeStr && line.length < 30) return false;
                    return true;
                });

                let title = cleanLines.sort((a, b) => b.length - a.length)[0] || rawText;
                title = title.replace(/^(\d+)\s*(menit|jam|hari|minute|hour|day|minutes|hours|days)\s*(lalu|ago)\s*-?\s*/i, '');
                const href = link.href;
                const lowerUrl = href.toLowerCase();
                const lowerTitle = title.toLowerCase();

                if (!title || title.length < 20) continue;
                if (!href.startsWith('http')) continue;

                if (oldYears.some(y => lowerUrl.includes(y))) continue;

                const wordCount = title.split(/\s+/).length;
                if (wordCount < 4) continue;

                if (regionPrefixes.some(p => lowerTitle.startsWith(p))) {
                    if (wordCount < 8) continue;
                }

                if (titleBlacklist.some(term => lowerTitle.includes(term))) continue;

                const validUrlPatterns = [
                    '/berita/', '/read/', '/detail/', '/news/', '/artikel/', '/view/',
                    currentYearStr
                ];

                const isNewsUrl = validUrlPatterns.some(pattern => lowerUrl.includes(pattern));
                const hasNumericId = /\/\d{5,}\//.test(href);
                const hasDetikId = /\/d-\d+/.test(href);

                if (!isNewsUrl && !lowerUrl.includes(currentYearStr) && !hasNumericId && !hasDetikId) {
                    continue;
                }

                results.push({
                    title: title,
                    url: href,
                    dateRaw: '',
                    snippet: 'N/A'
                });
            }

            return {
                articles: results,
                debug: debugLog
            };
        });
    }

    /**
     * Filter candidate articles
     */
    static filterCandidates(articles) {
        const uniqueUrls = new Set();

        return articles.filter(article => {
            const title = article.title.toLowerCase();
            const url = article.url.toLowerCase();

            if (title.length < 15) return false;
            if (title.includes('.com') || title.includes('.id') || title.includes('.co.id') || title.includes('tribun')) return false;

            const junkWords = ['template', 'blogger', 'theme', 'wordpress', 'jasa', 'iklan', 'promo', 'login', 'signup'];
            if (junkWords.some(word => title.includes(word) || url.includes(word))) return false;

            if (uniqueUrls.has(article.url)) return false;

            uniqueUrls.add(article.url);
            return true;
        });
    }

    /**
     * Process articles to get metadata and filter by date
     */
    static async processArticles(page, candidates, start, end) {
        const finalResults = [];
        const processLimit = Math.min(candidates.length, 50);

        for (let i = 0; i < processLimit; i++) {
            const item = candidates[i];
            console.log(`[DEBUG] Processing (${i + 1}/${processLimit}): ${item.title.substring(0, 30)}...`);

            let metaData = { date: null, desc: null };

            try {
                await page.goto(item.url, { waitUntil: 'domcontentloaded', timeout: 20000 });
                metaData = await this.extractMetadata(page);
            } catch (err) {
                console.log(`  -> Failed to open detail page (Using Fallback): ${err.message}`);
            }

            const rawDate = metaData.date || item.dateRaw;
            const parsedDate = DateParserService.parseEnhancedDate(rawDate);
            const desc = metaData.desc || item.snippet;

            let displayDate = 'N/A';

            if (parsedDate) {
                displayDate = DateParserService.formatForDisplay(parsedDate);
                if (DateParserService.isInRange(parsedDate, start, end)) {
                    finalResults.push({
                        title: item.title,
                        url: item.url,
                        publish_date: displayDate,
                        content_snippet: desc || 'N/A'
                    });
                } else {
                    console.log(`  -> Skipped (Date out of range: ${parsedDate.format('YYYY-MM-DD')})`);
                }
            } else {
                finalResults.push({
                    title: item.title,
                    url: item.url,
                    publish_date: `N/A (Raw: ${rawDate ? rawDate.substring(0, 20) : 'None'})`,
                    content_snippet: desc || 'N/A'
                });
            }
        }

        return finalResults;
    }

    /**
     * Extract metadata from article page
     */
    static async extractMetadata(page) {
        return await page.evaluate(() => {
            const getMeta = (propNames) => {
                for (const name of propNames) {
                    const el = document.querySelector(`meta[property="${name}"], meta[name="${name}"]`);
                    if (el && el.getAttribute('content')) return el.getAttribute('content');
                }
                return null;
            };

            const getElementText = (selectors) => {
                for (const sel of selectors) {
                    const el = document.querySelector(sel);
                    if (el) {
                        return el.getAttribute('datetime') || el.innerText.trim();
                    }
                }
                return null;
            };

            let jsonDate = null;
            try {
                const scripts = document.querySelectorAll('script[type="application/ld+json"]');
                for (const s of scripts) {
                    const json = JSON.parse(s.innerText);
                    if (json.datePublished) jsonDate = json.datePublished;
                    if (json['@graph']) {
                        const article = json['@graph'].find(x => x.datePublished);
                        if (article) jsonDate = article.datePublished;
                    }
                    if (jsonDate) break;
                }
            } catch (e) { }

            const dateFound = jsonDate ||
                getMeta([
                    'article:published_time',
                    'og:article:published_time',
                    'date',
                    'published_time',
                    'pubdate',
                    'publish-date',
                    'original-publish-date'
                ]) ||
                getElementText([
                    'time',
                    '.time',
                    '.date',
                    '.post-date',
                    '.meta-date',
                    'span[class*="date"]'
                ]);

            return {
                date: dateFound,
                desc: getMeta(['description', 'og:description', 'twitter:description'])
            };
        });
    }

    /**
     * Save articles to database
     */
    static async saveToDatabase(articles) {
        let insertedCount = 0;
        let skippedCount = 0;

        for (const article of articles) {
            try {
                const existingId = await Article.checkUrlExists(article.url);
                if (!existingId) {
                    await Article.create(article);
                    insertedCount++;
                } else {
                    skippedCount++;
                }
            } catch (err) {
                console.log(`[WARN] Gagal insert artikel: ${err.message}`);
                skippedCount++;
            }
        }

        console.log(`[SUCCESS] ${insertedCount} artikel berhasil disimpan, ${skippedCount} dilewati (duplikat)`);
        return { insertedCount, skippedCount };
    }
}

module.exports = ScraperService;
