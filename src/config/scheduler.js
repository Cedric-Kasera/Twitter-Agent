import cron from "node-cron";
import { newsFetcher } from "../services/newsFetcher.js";
import { curateDailyArticles, markAsPosted } from "../services/contentCurator.js";
import { generateNewsTweet, generateNoonTweet } from "../services/tweetGenerator.js";
import { postTweet } from "../services/twitterPoster.js";

/**
 * Schedule tweets
 */
export function scheduleTweets() {
    // 8 AM: Morning news tweet
    cron.schedule("0 8 * * *", async () => {
        console.log("Running 8 AM news tweet...");
        await postDailyNewsTweet();
    }, { timezone: "Africa/Nairobi" });

    // 12 PM: Noon standalone tweet
    cron.schedule("0 12 * * *", async () => {
        console.log("Running 12 PM standalone tweet...");
        try {
            const text = await generateNoonTweet();
            const tweetId = await postTweet(text);
            console.log("Noon tweet posted, ID:", tweetId);
        } catch (err) {
            console.error("Error posting noon tweet:", err);
        }
    }, { timezone: "Africa/Nairobi" });

    // 6 PM: Evening news tweet
    cron.schedule("0 18 * * *", async () => {
        console.log("Running 6 PM news tweet...");
        await postDailyNewsTweet();
    }, { timezone: "Africa/Nairobi" });
}

/**
 * Helper to fetch, curate, generate, and post a news tweet
 */
async function postDailyNewsTweet() {
    try {
        const techNews = await newsFetcher("tech", 5);
        const businessNews = await newsFetcher("business", 5);

        const combined = [...techNews, ...businessNews];
        const curated = curateDailyArticles(combined, 1); // 1 per slot (8 AM / 6 PM)

        if (curated.length === 0) {
            console.log("No new articles to post today.");
            return;
        }

        for (const article of curated) {
            const text = await generateNewsTweet(article);
            console.log("Generated tweet:", text);
            const tweetId = await postTweet(text, article.image);
            console.log("Posted tweet ID:", tweetId);
        }

        markAsPosted(curated);
    } catch (error) {
        console.error("Error in posting daily news tweet:", error);
    }
}

// Start scheduler immediately
// Scheduler is started from the application entrypoint (`src/index.js`).
// Avoid starting automatically during import to prevent duplicate scheduling.
