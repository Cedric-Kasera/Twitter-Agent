import Parser from "rss-parser";
import axios from "axios";
import * as cheerio from "cheerio";
import { RSS_FEEDS } from "../config/sources.js";

const parser = new Parser();
const REQUEST_TIMEOUT = 8000; // 8 seconds timeout

/**
 * Fetch a single RSS feed safely
 */
async function fetchRSSFeed(url) {
    try {
        const feed = await parser.parseURL(url);
        return feed.items.map(item => ({
            title: item.title,
            link: item.link,
            pubDate: item.pubDate,
            content: item.contentSnippet || item.content,
            image: item.enclosure?.url || null
        }));
    } catch (error) {
        console.warn(`[RSS ERROR] Skipping feed: ${url} -> ${error.message}`);
        return [];
    }
}

/**
 * Scrape main image from a webpage if RSS doesn't provide one
 */
async function fetchImageFromLink(url) {
    try {
        const res = await axios.get(url, { timeout: REQUEST_TIMEOUT });
        const $ = cheerio.load(res.data);
        const img = $("meta[property='og:image']").attr("content");
        return img || null;
    } catch (error) {
        console.warn(`[IMAGE FETCH ERROR] ${url} -> ${error.message}`);
        return null;
    }
}

/**
 * Fetch latest news for a category
 */
export async function fetchLatestNews(category = "tech", limit = 5) {
    const feeds = RSS_FEEDS[category] || [];
    let allItems = [];

    // Fetch feeds sequentially (can be parallelized later)
    for (const feed of feeds) {
        const items = await fetchRSSFeed(feed);
        if (items.length === 0) {
            console.warn(`[RSS WARNING] No items fetched from: ${feed}`);
        }
        allItems.push(...items);
    }

    // Sort newest first
    allItems.sort((a, b) => new Date(b.pubDate) - new Date(a.pubDate));

    // Limit results and ensure content fallback
    const latest = allItems.slice(0, limit).map(item => ({
        ...item,
        content: item.content || item.title
    }));

    // Fetch images in parallel safely
    await Promise.all(
        latest.map(async item => {
            if (!item.image) {
                item.image = await fetchImageFromLink(item.link);
                if (!item.image) console.warn(`No image found for: ${item.link}`);
            }
        })
    );

    return latest;
}
