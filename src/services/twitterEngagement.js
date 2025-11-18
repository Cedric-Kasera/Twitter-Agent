// services/twitterEngagement.js
import twitterClient from "../config/twitter.js";
import fs from "fs";
import path from "path";

const LOG_FILE = path.resolve("./postedIds.json");

/**
 * Load previously engaged tweet IDs to avoid duplicates
 * @returns array of tweet IDs
 */
function loadPostedIds() {
    try {
        if (!fs.existsSync(LOG_FILE)) return [];
        const data = fs.readFileSync(LOG_FILE, "utf-8");
        return JSON.parse(data);
    } catch (err) {
        console.warn("Failed to load posted IDs:", err);
        return [];
    }
}

/**
 * Save posted tweet IDs
 * @param {Array<string>} ids
 */
function savePostedIds(ids) {
    try {
        fs.writeFileSync(LOG_FILE, JSON.stringify(ids, null, 2));
    } catch (err) {
        console.error("Failed to save posted IDs:", err);
    }
}

/**
 * Search, like, and retweet tweets for a given query
 * @param {string} query - Twitter search query
 * @param {number} limit - max tweets to engage with per run
 */
export async function engageWithTweets(query, limit = 5) {
    try {
        const postedIds = loadPostedIds();

        // Search recent tweets
        const search = await twitterClient.v2.search(query, {
            "tweet.fields": ["author_id", "created_at"],
            max_results: 10
        });

        if (!search.data || search.data.length === 0) return;

        let count = 0;
        for (const tweet of search.data) {
            if (count >= limit) break;
            if (postedIds.includes(tweet.id)) continue;

            try {
                // Like tweet
                await twitterClient.v2.like(process.env.TWITTER_USER_ID, tweet.id);

                // Retweet tweet
                await twitterClient.v2.retweet(process.env.TWITTER_USER_ID, tweet.id);

                console.log(`Liked & retweeted tweet: ${tweet.id} (${tweet.text.slice(0, 50)}...)`);

                postedIds.push(tweet.id);
                count++;
            } catch (err) {
                console.warn(`Failed to like/retweet tweet ${tweet.id}:`, err.message);
            }
        }

        // Save updated IDs
        savePostedIds(postedIds);
    } catch (err) {
        console.error("Error in engageWithTweets:", err);
    }
}
