// services/tweetGenerator.js
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

// Initialize Gemini via the Google GenAI SDK
const gemini = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY
});

/**
 * Generate a tweet for a news article
 * @param {Object} article { title, content }
 * @returns string - generated tweet text
 */
export async function generateNewsTweet(article) {
    const prompt = `
Generate a concise, engaging, and readable tweet under 280 characters
summarizing the following news article. Do NOT include the link. Make it catchy and tweetable.

Title: ${article.title}
Content: ${article.content}
`;

    try {
        const response = await gemini.models.generateContent({
            model: "gemini-2.0-flash",
            contents: prompt
        });

        return response.text?.trim() || article.title;
    } catch (err) {
        console.error("Error generating news tweet:", err);
        return article.title; // fallback
    }
}

/**
 * Generate a standalone noon tweet (short post, statement, or question)
 * @returns string - generated tweet
 */
export async function generateNoonTweet() {
    const prompt = `
Generate a short, witty, or thought-provoking tweet under 280 characters
in tech or business. It should NOT reference any news source.
`;

    try {
        const response = await gemini.models.generateContent({
            model: "gemini-2.0-flash",
            contents: prompt
        });

        return response.text?.trim() || "This is one of those random posts. Pay no attention😎😎!";
    } catch (err) {
        console.error("Error generating noon tweet:", err);
        return "This is one of those random posts. Pay no attention😎😎!";
    }
}
