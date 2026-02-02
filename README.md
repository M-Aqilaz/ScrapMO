# Universal News Scraper 📰

A simple Node.js application to scrape news articles from online media sites (that don't provide RSS feeds) and export them to Excel.

## Features
- **Heuristic Scraping**: Automatically attempts to find news articles based on common HTML structures (`<article>`, `.news-item`, `h1`-`h6`, etc.).
- **Date Filtering**: Scraping respects user-defined date ranges.
- **Excel Export**: Download results directly as `.xlsx`.
- **User Interface**: Simple web interface for input.

## Requirements
- Node.js installed.
- Internet connection (for scraping).

## Installation
1. Open a terminal in this folder.
2. Run:
   ```bash
   npm install
   ```

## Usage
1. Start the server:
   ```bash
   npm start
   ```
   Or:
   ```bash
   node server.js
   ```
2. Open your browser and go to:
   [http://localhost:3001](http://localhost:3001)
3. Enter the news index URL (e.g., `https://www.cnnindonesia.com/` or `https://aceh.tribunnews.com/news`).
4. Select the Start and End dates.
5. Click **Generate & Download Excel**.

## Notes
- Does not work on sites strictly blocking automated requests (CAPTCHA).
- Date parsing attempts to handle Indonesian formats ("Senin, 25 Januari") and English formats.
