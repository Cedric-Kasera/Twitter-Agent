import { fetchLatestNews } from "./services/newsFetcher.js";
import { curateDailyArticles, markAsPosted } from "./services/contentCurator.js";
import { generateNewsTweet, generateNoonTweet } from "./services/tweetGenerator.js";
import { postTweet } from "./services/twitterPoster.js";

async function testPosting() {
    try {
        console.log("Testing news tweet...");
        const techNews = await fetchLatestNews("tech", 5);
        const businessNews = await fetchLatestNews("business", 5);

        const combined = [...techNews, ...businessNews];
        const curated = curateDailyArticles(combined, 1); // test 1 article

        if (curated.length === 0) {
            console.log("No new articles to post.");
            return;
        }

        for (const article of curated) {
            const text = await generateNewsTweet(article);
            console.log("Tweet text:", text);
            console.log("Image URL:", article.image);

            // Post to Twitter
            const tweetId = await postTweet(text, article.image);
            console.log("Tweet posted with ID:", tweetId);
        }

        markAsPosted(curated);
    } catch (error) {
        console.error("Error during test posting:", error);
    }

    // Test noon standalone tweet
    console.log("\nTesting noon standalone tweet...");
    const noonTweet = await generateNoonTweet();
    console.log("Noon tweet text:", noonTweet);
    const noonTweetId = await postTweet(noonTweet);
    console.log("Noon tweet posted with ID:", noonTweetId);
}

testPosting();
