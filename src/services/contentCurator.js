import fs from "fs";
import path from "path";

const POSTED_FILE = path.join(process.cwd(), "data/posted.json");

/**
 * Load previously posted article URLs to avoid duplicates
 */
function loadPostedArticles() {
    if (!fs.existsSync(POSTED_FILE)) return [];
    const data = fs.readFileSync(POSTED_FILE, "utf-8");
    return JSON.parse(data);
}

/**
 * Save newly posted articles
 */
function savePostedArticles(posts) {
    const dir = path.dirname(POSTED_FILE);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(POSTED_FILE, JSON.stringify(posts, null, 2));
}

/**
 * Curate 2 articles from a list
 * @param {Array} articles - array of articles {title, link, content, image}
 */
export function curateDailyArticles(articles, count = 2) {
    const posted = loadPostedArticles();
    const curated = [];

    for (const article of articles) {
        // Skip if already posted
        if (posted.includes(article.link)) continue;

        curated.push(article);
        if (curated.length >= count) break;
    }

    return curated;
}

/**
 * After posting tweets, mark them as posted
 */
export function markAsPosted(articles) {
    const posted = loadPostedArticles();
    const newLinks = articles.map(a => a.link);
    savePostedArticles([...posted, ...newLinks]);
}
