import twitterClient from "../config/twitter.js";
import axios from "axios";
import sharp from "sharp";

/**
 * Upload an image from URL to Twitter and return media_id
 */
async function uploadImage(imageUrl) {
    if (!imageUrl) return null;

    try {
        // Fetch the image as a buffer
        const response = await axios.get(imageUrl, { responseType: "arraybuffer" });

        // Resize and compress image to reduce memory usage
        const buffer = await sharp(response.data)
            .resize({ width: 1200 }) // Max width 1200px
            .jpeg({ quality: 80 })    // Compress image
            .toBuffer();

        // Upload to Twitter
        const mediaId = await twitterClient.v1.uploadMedia(buffer, { type: "png" });
        return mediaId;
    } catch (error) {
        console.warn("Failed to upload image:", imageUrl, error.message);
        return null;
    }
}

/**
 * Post a tweet with optional image
 */
export async function postTweet(text, imageUrl = null) {
    try {
        let mediaId = null;

        if (imageUrl) {
            mediaId = await uploadImage(imageUrl);
        }

        const tweet = await twitterClient.v2.tweet({
            text,
            media: mediaId ? { media_ids: [mediaId] } : undefined
        });

        console.log("Tweet posted:", tweet.data.id);
        return tweet.data.id;

    } catch (error) {
        console.error("Error posting tweet:", error);
        return null;
    }
}
